export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
export function createWhatsAppMessage(payload: { productName: string; size?: string; color?: string; quantity: number; price: number; url: string }) {
  return [`Olá! Tenho interesse no produto ${payload.productName}.`, `Tamanho: ${payload.size || 'A combinar'}`, `Cor/variação: ${payload.color || 'A combinar'}`, `Quantidade: ${payload.quantity}`, `Preço: ${formatCurrency(payload.price)}`, `Link: ${payload.url}`].join('\n')
}
export function createWhatsAppUrl(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
