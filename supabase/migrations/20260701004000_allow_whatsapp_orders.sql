-- Allow WhatsApp checkout orders to be saved in the existing orders table.

alter table public.orders drop constraint if exists orders_payment_method_check;

alter table public.orders add constraint orders_payment_method_check
check (payment_method in ('paystack', 'flutterwave', 'transfer', 'whatsapp')) not valid;
