const WHATSAPP_NUMBER = "5511949848756";

type QuoteMessageData = {
  company?: string;
  cnpj?: string;
  name?: string;
  phone?: string;
  email?: string;
  itemsNeed?: string;
  cityUf?: string;
  segment?: string;
  estimatedVolume?: string;
  urgency?: string;
  additionalMessage?: string;
};

function cleanText(value: string | undefined): string {
  return (value ?? "").trim();
}

export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildContactMessage(): string {
  return "Olá! Tudo bem? Gostaria de mais informações sobre os produtos da BWK Utilidades e como posso comprar.";
}

export function buildQuoteMessage(data: QuoteMessageData): string {
  const lines = ["Olá! Quero solicitar uma cotação."];

  if (cleanText(data.company)) {
    lines.push(`Empresa: ${cleanText(data.company)}`);
  }
  if (cleanText(data.cnpj)) {
    lines.push(`CNPJ: ${cleanText(data.cnpj)}`);
  }
  if (cleanText(data.name)) {
    lines.push(`Nome: ${cleanText(data.name)}`);
  }
  if (cleanText(data.phone)) {
    lines.push(`Telefone: ${cleanText(data.phone)}`);
  }
  if (cleanText(data.email)) {
    lines.push(`E-mail: ${cleanText(data.email)}`);
  }
  if (cleanText(data.itemsNeed)) {
    lines.push(`Itens/necessidade: ${cleanText(data.itemsNeed)}`);
  }
  if (cleanText(data.cityUf)) {
    lines.push(`Cidade/UF: ${cleanText(data.cityUf)}`);
  }

  if (cleanText(data.segment)) {
    lines.push(`Segmento: ${cleanText(data.segment)}`);
  }
  if (cleanText(data.estimatedVolume)) {
    lines.push(`Volume estimado: ${cleanText(data.estimatedVolume)}`);
  }
  if (cleanText(data.urgency)) {
    lines.push(`Urgência: ${cleanText(data.urgency)}`);
  }
  if (cleanText(data.additionalMessage)) {
    lines.push(`Mensagem adicional: ${cleanText(data.additionalMessage)}`);
  }

  return lines.join("\n");
}
