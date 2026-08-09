import { GoogleGenAI, Type } from "@google/genai";
import { GroundingSource, ReceiptData } from "../types/finance";

export interface AnalyzeDocumentParams {
  fileBuffer: ArrayBuffer;
  mimeType: string;
  expectedValue?: string | null;
  requestedModel?: string | null;
  useGoogleSearch?: boolean;
}

/**
 * Encapsula a lógica de chamada ao Gemini AI para análise e extração de documentos fiscais
 */
export async function analyzeFinancialDocument({
  fileBuffer,
  mimeType,
  expectedValue,
  requestedModel = 'gemini-3.5-flash',
  useGoogleSearch = false
}: AnalyzeDocumentParams): Promise<ReceiptData> {
  let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey === 'undefined' || apiKey === 'null' || apiKey === 'your-api-key') {
    apiKey = process.env.GEMINI_API_KEY;
  }
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    throw new Error("API_KEY_MISSING: Configuração do servidor ausente (API Key).");
  }

  const ai = new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build-ledger-iq',
      }
    }
  });

  const base64Data = Buffer.from(fileBuffer).toString('base64');

  const systemInstruction = `You are an expert data extraction assistant specializing in Brazilian financial documents, specifically Notas Fiscais (NF-e, NFC-e) and standard receipts. Analyze the provided image carefully. Pay special attention to the item descriptions and the supplier's name to infer the most accurate and granular accounting category possible (e.g., distinguish between 'Material de Escritório' and 'Material de Limpeza'). Extract: supplier_cnpj, supplier_name, issue_date (YYYY-MM-DD), total_value (numeric), payment_method (PIX, Credit Card, Debit Card, Boleto, Cash, or Unknown), access_key (44 digits, null if not found), consumer_id, and accounting_category. Return ONLY a valid JSON object without markdown formatting blocks. If googleSearch is enabled as a tool, you may look up the supplier or their CNPJ online to fill out or verify any missing, partial, or blurry details.`;

  const filePart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  const textPart = {
    text: "Extract data from this receipt.",
  };

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
    throw new Error("NO_TEXT_RETURNED: Nenhuma resposta retornada do Gemini.");
  }

  let aiData: any;
  try {
    aiData = JSON.parse(text);
  } catch (e) {
    throw new Error("PARSE_ERROR: Falha ao interpretar a resposta JSON da IA.");
  }

  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const groundingSources: GroundingSource[] = (groundingMetadata?.groundingChunks || []).flatMap((chunk: any) => {
    if (chunk.web) {
      return [{
        title: chunk.web.title,
        uri: chunk.web.uri
      }];
    }
    return [];
  });

  if (aiData.total_value === undefined || aiData.total_value === null) {
    if (expectedValue) {
      aiData.total_value = parseFloat(expectedValue);
    } else {
      throw new Error("INCOMPLETE_EXTRACTION: Valor total ilegível ou ausente na Nota Fiscal.");
    }
  }

  return {
    id: crypto.randomUUID(),
    cnpj: aiData.supplier_cnpj || "-",
    date: aiData.issue_date || "-",
    total_value: aiData.total_value || 0,
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
}
