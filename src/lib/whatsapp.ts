export const BRAIMARU_WHATSAPP_PHONE = '573233653482';

interface WhatsAppOptions { phone?: string | null; productName?: string; }

export function buildWhatsAppUrl({ phone, productName }: WhatsAppOptions = {}) {
  const resolvedPhone = phone ?? BRAIMARU_WHATSAPP_PHONE;
  const message = productName
    ? `Hola, estoy interesado/a en ${productName} de BRAIMARÚ. ¿Me pueden dar más información?`
    : 'Hola, quiero conocer más sobre los productos de BRAIMARÚ.';

  if (!resolvedPhone) return `https://wa.me/?text=${encodeURIComponent(message)}`;
  return `https://wa.me/${resolvedPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
