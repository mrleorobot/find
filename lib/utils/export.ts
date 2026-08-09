import { ReceiptData } from "../types/finance";
import { formatCNPJ, formatCurrency, formatDatePTBR, safeCsvString } from "./formatters";

/**
 * Exporta uma lista de comprovantes financeiros para CSV UTF-8
 */
export function exportHistoryCSV(
  history: ReceiptData[], 
  filename: string = `historico_despesas_${new Date().toISOString().split('T')[0]}.csv`,
  department: string = "Administrativo"
): void {
  if (history.length === 0) return;
  
  const headers = ['Fornecedor', 'CNPJ', 'Data', 'Valor_Total', 'Categoria', 'Centro_de_Custo', 'Confianca', 'Chave_Acesso'];
  
  const rows = history.map(item => [
    safeCsvString(item.supplier_name || ''),
    safeCsvString(item.cnpj),
    safeCsvString(item.date),
    item.total_value.toString(),
    safeCsvString(item.category),
    safeCsvString(department),
    (item.confidence_score || 0).toString(),
    safeCsvString(item.access_key || '')
  ].join(','));

  const csvContent = "\uFEFF" + headers.join(',') + '\n' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gera um texto resumido de uma nota para compartilhamento rápido (ex: WhatsApp/Email)
 */
export function generateShareSummary(result: ReceiptData): string {
  return `🧾 *Resumo da Despesa - LedgerIQ*\n\n` +
    `*Fornecedor:* ${result.supplier_name || 'N/A'}\n` +
    `*Valor:* ${formatCurrency(result.total_value)}\n` +
    `*Data:* ${formatDatePTBR(result.date)}\n` +
    `*Categoria:* ${result.category}\n` +
    `*CNPJ:* ${formatCNPJ(result.cnpj)}`;
}
