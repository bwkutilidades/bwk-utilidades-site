import { MessageCircle } from "lucide-react";
import { buildContactMessage, buildWhatsappUrl } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a
      href={buildWhatsappUrl(buildContactMessage())}
      target="_blank"
      rel="noreferrer noopener"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5C] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden md:inline font-medium">WhatsApp</span>
    </a>
  );
}
