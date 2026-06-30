import { productById, ngn } from "./catalog";
import type { CartItem } from "./cart";
import { deliveryMethodLabels, type DeliveryMethod } from "./orders";

export const WHATSAPP_DISPLAY = "+234 817 195 0268";
const WHATSAPP_PHONE = "2348171950268";
export const WHATSAPP_BASE = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;
const PAYMENT_BANK_NAME =
  (import.meta.env.VITE_PAYMENT_BANK_NAME as string | undefined)?.trim() || "Moniepoint";
const PAYMENT_ACCOUNT_NAME =
  (import.meta.env.VITE_PAYMENT_ACCOUNT_NAME as string | undefined)?.trim() || "LkClothiers";
const PAYMENT_ACCOUNT_NUMBER =
  (import.meta.env.VITE_PAYMENT_ACCOUNT_NUMBER as string | undefined)?.trim() || "5775644823";
const PICKUP_ADDRESS =
  (import.meta.env.VITE_PICKUP_ADDRESS as string | undefined)?.trim() ||
  "Block C, Suite 13 & 14, H & A Plaza, Wuye, Abuja FCT, Nigeria";

export function whatsappUrl(message: string) {
  return `${WHATSAPP_BASE}&text=${encodeURIComponent(message)}`;
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
  variantLabel = "",
) {
  const optionLabel = [color, size, variantLabel].filter(Boolean).join(", ");
  return whatsappUrl(
    [
      "Hi LK Clothiers, I would like to checkout with this piece:",
      `${productName} (${optionLabel}) x${qty}`,
      `Price: ${ngn(price * qty)}`,
      "Please send the payment details to complete this order.",
    ].join("\n"),
  );
}

export function checkoutWhatsAppUrl(
  items: CartItem[],
  subtotal: number,
  deliveryMethod?: DeliveryMethod,
  deliveryAddress?: string,
  discount = 0,
  customer?: { fullName?: string; phone?: string },
) {
  const total = subtotal - discount;
  const lines = items
    .map((item) => {
      const product = productById(item.id);
      const name = item.name ?? product?.name;
      if (!name) return null;
      const price = item.variantPrice ?? item.price ?? product?.price ?? 0;
      const variantLabel =
        item.variantType && item.variantValue ? `${item.variantType}: ${item.variantValue}` : "";
      const optionLabel = [item.color, item.size, variantLabel].filter(Boolean).join(", ");
      return `- ${name} (${optionLabel}) x${item.qty}: ${ngn(price * item.qty)}`;
    })
    .filter(Boolean)
    .join("\n");

  const message = [
    "Hi LK Clothiers, I would like to checkout with this order:",
    lines,
    `Subtotal: ${ngn(subtotal)}`,
    discount > 0 ? `Discount: -${ngn(discount)}` : "Discount: NGN 0",
    `Final order total: ${ngn(total)}`,
    customer?.fullName ? `Customer name: ${customer.fullName}` : "",
    customer?.phone ? `Phone: ${customer.phone}` : "",
    deliveryMethod ? `Delivery method: ${deliveryMethodLabels[deliveryMethod]}` : "",
    deliveryMethod === "pickup" ? `Pickup address: ${PICKUP_ADDRESS}` : "",
    deliveryMethod === "home" && deliveryAddress ? `Delivery address: ${deliveryAddress}` : "",
    "Payment details:",
    `Bank: ${PAYMENT_BANK_NAME}`,
    `Account Name: ${PAYMENT_ACCOUNT_NAME}`,
    `Account Number: ${PAYMENT_ACCOUNT_NUMBER}`,
    "Kindly share receipt after payment.",
  ]
    .filter(Boolean)
    .join("\n");

  return whatsappUrl(message);
}
