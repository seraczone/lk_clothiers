import { genericWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={genericWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-[color:var(--accent)] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden>
        <path d="M20.5 3.5A11 11 0 0 0 3.6 17.3L2 22l4.8-1.5A11 11 0 1 0 20.5 3.5Zm-8.5 17a8.5 8.5 0 0 1-4.3-1.2l-.3-.2-2.9.9.9-2.8-.2-.3A8.5 8.5 0 1 1 12 20.5Zm4.7-6.4c-.3-.1-1.5-.7-1.8-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5.2-.4c.1-.1.1-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.5-.6-.5h-.5c-.1 0-.4.1-.6.3-.2.3-.8.8-.8 2s.9 2.4 1 2.5c.1.2 1.7 2.6 4.2 3.6 2.5 1 2.5.7 3 .7s1.5-.6 1.7-1.2c.2-.6.2-1.1.1-1.2l-.5-.2Z" />
      </svg>
    </a>
  );
}
