export const BRAIMARU_WHATSAPP_PHONE: string | null = null;

interface WhatsAppOptions { phone?: string | null; productName?: string; }

export function buildWhatsAppUrl({ phone = BRAIMARU_WHATSAPP_PHONE, productName }: WhatsAppOptions = {}) {
  const message = productName
    ? `Hola, estoy interesado/a en ${productName} de BRAIMARÚ. ¿Me pueden dar más información?`
    : 'Hola, quiero conocer más sobre los productos de BRAIMARÚ.';

  if (!phone) return `https://wa.me/?text=${encodeURIComponent(message)}`;
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
