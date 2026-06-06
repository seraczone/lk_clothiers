import { productById, ngn } from "./catalog";
import type { CartItem } from "./cart";

export const WHATSAPP_DISPLAY = "+234 817 195 0268";
const WHATSAPP_PHONE = "2348171950268";
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_PHONE}`;

export function whatsappUrl(message: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

export function genericWhatsAppUrl() {
  return whatsappUrl("Hi LK Clothiers, I would like help choosing an outfit.");
}

export function productWhatsAppUrl(
  productName: string,
  price: number,
  color: string,
  size: string,
  qty = 1,
) {
  return whatsappUrl(
    [
      "Hi LK Clothiers, I would like to checkout with this piece:",
      `${productName} (${color}, ${size}) x${qty}`,
      `Price: ${ngn(price * qty)}`,
      "Please confirm availability, delivery fee, and payment details.",
    ].join("\n"),
  );
}

export function checkoutWhatsAppUrl(items: CartItem[], subtotal: number, shipping: number) {
  const lines = items
    .map((item) => {
      const product = productById(item.id);
      if (!product) return null;
      return `- ${product.name} (${item.color}, ${item.size}) x${item.qty}: ${ngn(product.price * item.qty)}`;
    })
    .filter(Boolean)
    .join("\n");

  return whatsappUrl(
    [
      "Hi LK Clothiers, I would like to checkout with this order:",
      lines,
      `Subtotal: ${ngn(subtotal)}`,
      `Shipping: ${shipping === 0 ? "Free" : ngn(shipping)}`,
      `Total: ${ngn(subtotal + shipping)}`,
      "Please confirm availability and payment details.",
    ].join("\n"),
  );
}
