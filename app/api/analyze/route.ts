import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

// Configuração do Rate Limiting
// 20 requisições por hora por IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; 
const MAX_REQUESTS = 20;

const globalForRateLimiter = global as unknown as {
  rateLimitMap: Map<string, { count: number; timestamp: number }>
};

const rateLimitMap = globalForRateLimiter.rateLimitMap || new Map<string, { count: number; timestamp: number }>();
if (process.env.NODE_ENV !== 'production') {
  globalForRateLimiter.rateLimitMap = rateLimitMap;
}

function checkRateLimit(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const userData = rateLimitMap.get(ip);

  if (!userData) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - 1, reset: now + RATE_LIMIT_WINDOW };
  }

  if (now - userData.timestamp > RATE_LIMIT_WINDOW) {
    // Reset window
    userData.count = 1;
    userData.timestamp = now;
    return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - 1, reset: now + RATE_LIMIT_WINDOW };
  }

  if (userData.count >= MAX_REQUESTS) {
    return { success: false, limit: MAX_REQUESTS, remaining: 0, reset: userData.timestamp + RATE_LIMIT_WINDOW };
  }

  userData.count += 1;
  return { success: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - userData.count, reset: userData.timestamp + RATE_LIMIT_WINDOW };
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown-ip";
    
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Limite de requisições excedido (20 por hora). Tente novamente mais tarde." }, 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.reset.toString()
          }
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const expectedValue = formData.get('expected_value');
    const requestedModel = formData.get('model') || 'gemini-3.5-flash';
    const useGoogleSearch = formData.get('google_search') === 'true';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado ou arquivo inválido." }, { status: 400 });
    }

    const validMimes = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp', 'image/tiff'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não suportado." }, { status: 415 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo excede o limite de 5MB." }, { status: 413 });
    }

    let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey === 'undefined' || apiKey === 'null' || apiKey === 'your-api-key') {
      apiKey = process.env.GEMINI_API_KEY;
    }
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return NextResponse.json({ error: "Configuração do servidor ausente (API Key)." }, { status: 500 });
    }

    // Configurando o cliente com headers de telemetria recomendados pelo AI Studio
    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const mimeType = file.type; 

    const systemInstruction = `You are an expert data extraction assistant specializing in Brazilian financial documents, specifically Notas Fiscais (NF-e, NFC-e) and standard receipts. Analyze the provided image carefully. Pay special attention to the item descriptions and the supplier's name to infer the most accurate and granular accounting category possible (e.g., distinguish between 'Material de Escritório' and 'Material de Limpeza'). Extract: supplier_cnpj, supplier_name, issue_date (YYYY-MM-DD), total_value (numeric), payment_method (PIX, Credit Card, Debit Card, Boleto, Cash, or Unknown), access_key (44 digits, null if not found), consumer_id, and accounting_category. Return ONLY a valid JSON object without markdown formatting blocks. If googleSearch is enabled as a tool, you may look up the supplier or their CNPJ online to fill out or verify any missing, partial, or blurry details.`;

    const filePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: "Extract data from this receipt.",
    };

    // Construindo as ferramentas baseadas em avanços tecnológicos (Google Search Grounding)
    const tools = [];
    if (useGoogleSearch) {
      tools.push({ googleSearch: {} });
    }

    const selectedModelName = requestedModel === 'gemini-3.1-pro' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

    const response = await ai.models.generateContent({
      model: selectedModelName, 
      contents: { parts: [filePart, textPart] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        tools: tools.length > 0 ? tools : undefined,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            supplier_cnpj: { type: Type.STRING, description: "The CNPJ (tax ID) of the issuer/seller. Format as 'XX.XXX.XXX/XXXX-XX'." },
            supplier_name: { type: Type.STRING, description: "The legal name (Razão Social) or trade name (Nome Fantasia) of the issuer." },
            issue_date: { type: Type.STRING, description: "The date the document was issued. Format strictly as 'YYYY-MM-DD'." },
            total_value: { type: Type.NUMBER, description: "The final total amount paid." },
            payment_method: { type: Type.STRING, description: "Identify how it was paid. Use one of these exact strings: 'PIX', 'Credit Card', 'Debit Card', 'Boleto', 'Cash', or 'Unknown'." },
            access_key: { type: Type.STRING, description: "The 'Chave de Acesso'. This is a specific 44-digit numeric code." },
            consumer_id: { type: Type.STRING, description: "The CPF or CNPJ of the consumer/buyer, if present on the receipt." },
            accounting_category: { type: Type.STRING, description: "Deduce the most granular accounting category possible based on the purchased items' descriptions and/or the supplier's business type. Examples: 'Material de Limpeza', 'Material de Escritório', 'Transporte', 'Alimentação', 'Serviços Essenciais', 'Manutenção TI', 'Hospedagem', 'Software', 'Outros'." },
            confidence_score: { type: Type.NUMBER, description: "A score from 1 to 100 representing your confidence in the extracted data's accuracy." },
            extraction_notes: { type: Type.STRING, description: "Optional notes if some parts of the image were blurry, illegible, or if you had to guess values." }
          },
          required: ["total_value", "accounting_category", "confidence_score"],
        }
      }
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("No text returned from Gemini");
    }

    let aiData;
    try {
        aiData = JSON.parse(text);
    } catch (e) {
        throw new Error("Failed to parse Gemini response");
    }

    // Extração de fontes de pesquisa se o grounding estiver ativo
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingSources = groundingMetadata?.groundingChunks?.map((chunk: any) => {
      if (chunk.web) {
        return {
          title: chunk.web.title,
          uri: chunk.web.uri
        };
      }
      return null;
    }).filter(Boolean) || [];

    const parsedData = {
      id: crypto.randomUUID(),
      cnpj: aiData.supplier_cnpj || "-",
      date: aiData.issue_date || "-",
      total_value: aiData.total_value || (expectedValue ? parseFloat(expectedValue as string) : 0),
      category: aiData.accounting_category || "Outros",
      supplier_name: aiData.supplier_name,
      payment_method: aiData.payment_method,
      access_key: aiData.access_key,
      consumer_id: aiData.consumer_id,
      confidence_score: aiData.confidence_score || 0,
      extraction_notes: aiData.extraction_notes || "",
      model_used: selectedModelName,
      grounding_sources: groundingSources
    };

    // Observabilidade e Tracking de Resiliência
    const isMissingCrucialData = !aiData.supplier_cnpj || aiData.total_value === undefined || aiData.total_value === null;
    const logData = {
      timestamp: new Date().toISOString(),
      event: "document_extraction",
      fileName: (file as File).name || "unknown",
      fileSize: (file as File).size || 0,
      mimeType: mimeType,
      success: !isMissingCrucialData,
      missingFields: [] as string[],
      extractedData: {
        cnpj_present: !!aiData.supplier_cnpj,
        value_present: aiData.total_value !== undefined && aiData.total_value !== null,
        category: aiData.accounting_category
      },
      expectedValue
    };

    const missingPortuguese = [];
    if (!aiData.supplier_cnpj) missingPortuguese.push("CNPJ não detectado");
    if (aiData.total_value === undefined || aiData.total_value === null) missingPortuguese.push("Valor total ilegível ou ausente");
    if (!aiData.issue_date) missingPortuguese.push("Data de emissão não encontrada");

    if (missingPortuguese.length > 0) {
      console.warn(JSON.stringify({ type: "EXTRACTION_WARNING", message: "IA com dificuldade para extrair dados", ...logData }));
      return NextResponse.json(
        { error: `Extração incompleta. Detalhes: ${missingPortuguese.join('; ')}. Por favor, verifique a legibilidade do arquivo e tente enviar novamente.` },
        { status: 422 }
      );
    } else {
      console.info(JSON.stringify({ type: "EXTRACTION_SUCCESS", message: "Extração concluída com sucesso", ...logData }));
    }

    return NextResponse.json(parsedData);
    
  } catch (error: any) {
    console.error(JSON.stringify({
      type: "EXTRACTION_ERROR",
      timestamp: new Date().toISOString(),
      event: "document_extraction_failed",
      error: error.message,
      stack: error.stack
    }));
    
    let errorMessage = "Falha ao analisar o documento. Ocorreu um erro interno.";
    if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
      errorMessage = "Erro de Autenticação: A chave da API Gemini configurada é inválida. Verifique as configurações (Settings -> Secrets) ou remova a variável NEXT_PUBLIC_GEMINI_API_KEY para usar a chave padrão grátis.";
    } else if (error.message.includes("No text returned") || error.message.includes("Failed to parse")) {
      errorMessage = "Erro no processamento da imagem pela IA. O documento pode estar muito borrado, cortado ou em formato inválido.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
