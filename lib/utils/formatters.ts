/**
 * Formata um número como moeda BRL (R$)
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "R$ 0,00";
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma string de CNPJ no padrão 00.000.000/0000-00
 */
export function formatCNPJ(cnpj: string | undefined | null): string {
  if (!cnpj) return "N/A";
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj; // Retorna original se não tiver 14 dígitos
  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Formata uma data YYYY-MM-DD para DD/MM/YYYY
 */
export function formatDatePTBR(dateString: string | undefined | null): string {
  if (!dateString) return "N/A";
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

/**
 * Escapa uma string para inclusão segura em arquivo CSV
 */
export function safeCsvString(str: string | undefined | null): string {
  return `"${(str || '').replace(/"/g, '""')}"`;
}
