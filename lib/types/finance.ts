export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ReceiptData {
  id: string;
  cnpj: string;
  date: string;
  total_value: number;
  category: string;
  supplier_name?: string;
  payment_method?: string;
  access_key?: string;
  consumer_id?: string;
  confidence_score?: number;
  extraction_notes?: string;
  model_used?: string;
  grounding_sources?: GroundingSource[];
}

export interface BatchItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMsg?: string;
  result?: ReceiptData;
}

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export const HISTORY_KEY = "@ais/receipt-history";
export const DEPT_KEY = "@ais/dept";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const INITIAL_MOCK_DATA: ReceiptData[] = [
  {
    id: "rec_demo_001",
    cnpj: "00.360.305/0001-04",
    date: "2026-07-22",
    total_value: 349.90,
    category: "Material de Escritório",
    supplier_name: "Kalunga Comércio e Indústria S.A.",
    payment_method: "Cartão de Crédito Corporate",
    access_key: "3526 0700 3603 0500 0104 5500 1000 0123 4510 0987 6543",
    consumer_id: "123.456.789-00",
    confidence_score: 99,
    extraction_notes: "Nota Fiscal de Consumidor Eletrônica (NFC-e) carregada em modo demonstrativo. Razão social e CNPJ validados.",
    model_used: "gemini-3.5-flash",
    grounding_sources: [
      {
        title: "Consulta Cadastral CNPJ - Kalunga S.A.",
        uri: "https://solucoes.receita.fazenda.gov.br"
      }
    ]
  },
  {
    id: "rec_demo_002",
    cnpj: "14.200.166/0001-66",
    date: "2026-07-20",
    total_value: 1850.00,
    category: "Serviços de TI / Nuvem",
    supplier_name: "Google Cloud Brasil Serviços de Internet",
    payment_method: "Boleto Bancário",
    access_key: "3526 0714 2001 6600 0166 5500 2000 0543 2110 1234 5678",
    confidence_score: 96,
    extraction_notes: "Fatura de infraestrutura em nuvem e licenças de software processada via análise documental.",
    model_used: "gemini-3.5-flash"
  },
  {
    id: "rec_demo_003",
    cnpj: "06.165.753/0001-92",
    date: "2026-07-18",
    total_value: 128.50,
    category: "Alimentação & Viagens",
    supplier_name: "Restaurante Sabor & Arte Ltda",
    payment_method: "Pix",
    confidence_score: 92,
    extraction_notes: "Cupom fiscal com desgaste térmico leve recuperado com sucesso pelo motor OCR.",
    model_used: "gemini-3.1-pro"
  },
  {
    id: "rec_demo_004",
    cnpj: "33.000.167/0001-01",
    date: "2026-07-15",
    total_value: 412.00,
    category: "Combustível / Frota",
    supplier_name: "Posto Petrobras Maracanã",
    payment_method: "Cartão de Débito",
    access_key: "3326 0733 0001 6700 0101 5500 1000 0987 6543 1234 5678",
    confidence_score: 94,
    extraction_notes: "Abastecimento de veículos da frota comercial. Categoria associada automaticamente.",
    model_used: "gemini-3.5-flash"
  }
];
