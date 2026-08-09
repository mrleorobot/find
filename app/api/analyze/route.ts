import { NextResponse } from 'next/server';
import { analyzeFinancialDocument } from '@/lib/services/gemini';

// Rate Limiting Config: 20 requisições por hora por IP
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
    const expectedValue = formData.get('expected_value') as string | null;
    const requestedModel = formData.get('model') as string | null;
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

    const buffer = await file.arrayBuffer();

    const parsedData = await analyzeFinancialDocument({
      fileBuffer: buffer,
      mimeType: file.type,
      expectedValue,
      requestedModel,
      useGoogleSearch
    });

    console.info(JSON.stringify({
      type: "EXTRACTION_SUCCESS",
      timestamp: new Date().toISOString(),
      fileName: (file as File).name || "unknown",
      fileSize: (file as File).size || 0,
      mimeType: file.type,
      cnpj: parsedData.cnpj,
      totalValue: parsedData.total_value,
      category: parsedData.category
    }));

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error(JSON.stringify({
      type: "EXTRACTION_ERROR",
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    }));

    let status = 500;
    let errorMessage = "Falha ao analisar o documento. Ocorreu um erro interno.";

    if (error.message?.includes("API_KEY_MISSING")) {
      errorMessage = "Configuração do servidor ausente (API Key).";
    } else if (error.message?.includes("API key not valid") || error.message?.includes("API_KEY_INVALID")) {
      errorMessage = "Erro de Autenticação: A chave da API Gemini é inválida. Verifique os secrets do projeto.";
    } else if (error.message?.includes("INCOMPLETE_EXTRACTION")) {
      status = 422;
      errorMessage = "Extração incompleta: Valor total ilegível ou ausente na Nota Fiscal. Verifique a qualidade do arquivo.";
    } else if (error.message?.includes("NO_TEXT_RETURNED") || error.message?.includes("PARSE_ERROR")) {
      errorMessage = "Erro no processamento da imagem pela IA. O documento pode estar muito borrado ou em formato ilegível.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
