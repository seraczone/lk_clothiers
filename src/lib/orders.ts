import { productById, ngn } from "@/lib/catalog";
import type { CartItem } from "@/lib/cart";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type DeliveryMethod = "pickup" | "home";

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
};

export type SavedOrder = {
  id: string;
  createdAt: string;
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "paystack" | "flutterwave" | "transfer" | "whatsapp";
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  customerEmailBody: string;
  adminNotificationBody: string;
};

const ordersKey = "lk_orders_v1";

export const deliveryMethodLabels: Record<DeliveryMethod, string> = {
  pickup: "Pick Up at Store",
  home: "Home Delivery",
};

export function createOrderId() {
  const stamp = Date.now().toString().slice(-6);
  return `LK-${stamp}`;
}

export function saveLocalOrder(order: SavedOrder) {
  if (typeof window === "undefined") return;
  const orders = readLocalOrders();
  window.localStorage.setItem(ordersKey, JSON.stringify([order, ...orders].slice(0, 60)));
}

export function readLocalOrders(): SavedOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(ordersKey) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedOrder);
  } catch {
    return [];
  }
}

export async function listOrders(): Promise<SavedOrder[]> {
  const localOrders = readLocalOrders();

  if (!isSupabaseConfigured || !supabase) return localOrders;

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, customer, items, subtotal, discount, total, payment_method, delivery_method, delivery_address, status, customer_email_body, admin_notification_body",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.info(
      "Supabase orders could not be loaded. Falling back to local orders:",
      error.message,
    );
    return localOrders;
  }

  const remoteOrders = (data ?? []).map(orderFromRow).filter(isSavedOrder);
  if (remoteOrders.length === 0) return localOrders;

  const localOnly = localOrders.filter(
    (localOrder) => !remoteOrders.some((remoteOrder) => remoteOrder.id === localOrder.id),
  );

  return [...remoteOrders, ...localOnly];
}

export async function saveOrder(order: SavedOrder) {
  saveLocalOrder(order);

  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from("orders").insert({
    id: order.id,
    created_at: order.createdAt,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    payment_method: order.paymentMethod,
    delivery_method: order.deliveryMethod,
    delivery_address: order.deliveryAddress ?? null,
    status: order.status,
    customer_email_body: order.customerEmailBody,
    admin_notification_body: order.adminNotificationBody,
  });

  if (error) {
    console.info("Order was saved locally. Supabase order insert skipped:", error.message);
  }
}

export async function updateOrderStatus(
  order: SavedOrder,
  status: SavedOrder["status"],
): Promise<SavedOrder> {
  const updatedOrder: SavedOrder = { ...order, status };
  updateLocalOrder(updatedOrder);

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    if (error) {
      console.info("Order status was updated locally. Supabase update skipped:", error.message);
    }
  }

  return updatedOrder;
}

function updateLocalOrder(order: SavedOrder) {
  if (typeof window === "undefined") return;
  const orders = readLocalOrders();
  const existingIndex = orders.findIndex((item) => item.id === order.id);
  const nextOrders =
    existingIndex >= 0
      ? orders.map((item) => (item.id === order.id ? order : item))
      : [order, ...orders];
  window.localStorage.setItem(ordersKey, JSON.stringify(nextOrders.slice(0, 60)));
}

export function buildCustomerEmailBody(order: SavedOrder) {
  return [
    `Dear ${order.customer.firstName},`,
    "",
    `Thank you for your LK Clothiers order ${order.id}.`,
    "",
    "Order summary:",
    order.items.map(formatOrderLine).filter(Boolean).join("\n"),
    `Subtotal: ${ngn(order.subtotal)}`,
    order.discount > 0 ? `Discount: -${ngn(order.discount)}` : "Discount: NGN 0",
    `Final order total: ${ngn(order.total)}`,
    "",
    `Delivery method: ${deliveryMethodLabels[order.deliveryMethod]}`,
    order.deliveryAddress ? `Delivery address: ${order.deliveryAddress}` : "",
    "",
    order.deliveryMethod === "pickup"
      ? "We will notify you when your items are ready for collection."
      : "Our team will contact you shortly to confirm delivery arrangements.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function buildAdminNotificationBody(order: SavedOrder) {
  return [
    `New order ${order.id}`,
    `Customer: ${order.customer.firstName} ${order.customer.lastName}`,
    `Email: ${order.customer.email}`,
    `Phone: ${order.customer.phone}`,
    `Payment: ${order.paymentMethod}`,
    `Delivery method: ${deliveryMethodLabels[order.deliveryMethod]}`,
    order.deliveryAddress ? `Delivery address: ${order.deliveryAddress}` : "",
    "",
    "Items:",
    order.items.map(formatOrderLine).filter(Boolean).join("\n"),
    `Subtotal: ${ngn(order.subtotal)}`,
    order.discount > 0 ? `Discount: -${ngn(order.discount)}` : "Discount: NGN 0",
    `Final order total: ${ngn(order.total)}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatOrderLine(item: CartItem) {
  const product = productById(item.id);
  const name = item.name ?? product?.name;
  if (!name) return "";
  const price = item.variantPrice ?? item.price ?? product?.price ?? 0;
  const options = [item.color, item.size, formatVariantLabel(item)].filter(Boolean).join(", ");
  return `- ${name} (${options}) x${item.qty}: ${ngn(price * item.qty)}`;
}

function formatVariantLabel(item: CartItem) {
  if (!item.variantType || !item.variantValue) return "";
  return `${item.variantType}: ${item.variantValue}`;
}

function orderFromRow(row: Record<string, unknown>): SavedOrder {
  return {
    id: String(row.id ?? ""),
    createdAt: String(row.created_at ?? ""),
    customer: normalizeCustomer(row.customer),
    items: Array.isArray(row.items) ? (row.items as CartItem[]) : [],
    subtotal: Number(row.subtotal ?? 0),
    discount: Number(row.discount ?? 0),
    total: Number(row.total ?? 0),
    paymentMethod: normalizePaymentMethod(row.payment_method),
    deliveryMethod: normalizeDeliveryMethod(row.delivery_method),
    deliveryAddress:
      typeof row.delivery_address === "string" && row.delivery_address.trim()
        ? row.delivery_address
        : undefined,
    status: normalizeStatus(row.status),
    customerEmailBody: typeof row.customer_email_body === "string" ? row.customer_email_body : "",
    adminNotificationBody:
      typeof row.admin_notification_body === "string" ? row.admin_notification_body : "",
  };
}

function normalizeCustomer(value: unknown): CheckoutCustomer {
  const customer = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    firstName: typeof customer.firstName === "string" ? customer.firstName : "",
    lastName: typeof customer.lastName === "string" ? customer.lastName : "",
    email: typeof customer.email === "string" ? customer.email : "",
    phone: typeof customer.phone === "string" ? customer.phone : "",
    city: typeof customer.city === "string" ? customer.city : "",
    state: typeof customer.state === "string" ? customer.state : "",
  };
}

function normalizePaymentMethod(value: unknown): SavedOrder["paymentMethod"] {
  if (value === "whatsapp") return value;
  if (value === "flutterwave" || value === "transfer") return value;
  return "paystack";
}

function normalizeDeliveryMethod(value: unknown): DeliveryMethod {
  return value === "home" ? "home" : "pickup";
}

function normalizeStatus(value: unknown): SavedOrder["status"] {
  if (value === "Pending" || value === "Delivered" || value === "Cancelled") return value;
  return "Processing";
}

function isSavedOrder(value: unknown): value is SavedOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Record<string, unknown>;
  return (
    typeof order.id === "string" &&
    typeof order.createdAt === "string" &&
    typeof order.subtotal === "number" &&
    typeof order.discount === "number" &&
    typeof order.total === "number" &&
    (order.deliveryMethod === "pickup" || order.deliveryMethod === "home") &&
    Array.isArray(order.items)
  );
}
