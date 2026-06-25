import { productById, ngn } from "./catalog";
import type { CartItem } from "./cart";
import { deliveryMethodLabels, type DeliveryMethod } from "./orders";

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
      "Please confirm availability, payment details, and delivery arrangements.",
    ].join("\n"),
  );
}

export function checkoutWhatsAppUrl(
  items: CartItem[],
  subtotal: number,
  deliveryMethod?: DeliveryMethod,
  deliveryAddress?: string,
  discount = 0,
) {
  const total = subtotal - discount;
  const lines = items
    .map((item) => {
      const product = productById(item.id);
      if (!product) return null;
      return `- ${product.name} (${item.color}, ${item.size}) x${item.qty}: ${ngn(product.price * item.qty)}`;
    })
    .filter(Boolean)
    .join("\n");

  const message = [
    "Hi LK Clothiers, I would like to checkout with this order:",
    lines,
    `Subtotal: ${ngn(subtotal)}`,
    discount > 0 ? `Discount: -${ngn(discount)}` : "Discount: NGN 0",
    `Final order total: ${ngn(total)}`,
    deliveryMethod ? `Delivery method: ${deliveryMethodLabels[deliveryMethod]}` : "",
    deliveryAddress ? `Delivery address: ${deliveryAddress}` : "",
    "Please confirm availability, payment details, and any delivery arrangements.",
  ]
    .filter(Boolean)
    .join("\n");

  return whatsappUrl(message);
}
