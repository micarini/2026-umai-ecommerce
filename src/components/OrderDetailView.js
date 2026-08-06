import Image from "next/image";
import Link from "next/link";

import OrderStatusSelect from "@/components/OrderStatusSelect";

const STATUS_STYLES = {
  Active: "bg-wasabi-light text-wasabi",
  Closed: "bg-sand text-teal/70",
  Shipped: "bg-teal/10 text-teal",
  Canceled: "bg-salmon/10 text-salmon",
};

function getProductImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/")) return image;
  return `/images/products/${image}`;
}

function formatCustomizations(customizations) {
  if (!customizations || customizations.length === 0) return "";
  return customizations
    .map((c) => `${c.name}: ${c.values ? c.values.join(", ") : c.value}`)
    .join(" · ");
}

export default function OrderDetailView({ order, backHref, backLabel, admin = false }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href={backHref} className="text-sm text-teal/50 hover:text-teal">
        ← {backLabel}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-teal">Order {order.orderNumber}</h1>
        {admin ? (
          <OrderStatusSelect orderId={order._id} status={order.status} />
        ) : (
          <span
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${STATUS_STYLES[order.status] || "bg-sand text-teal/70"}`}
          >
            {order.status}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-teal/50">
        {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-sand bg-white/40 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-teal/50">
            Contact &amp; delivery
          </h2>
          <p className="mt-2 text-teal">{order.user.name}</p>
          <p className="text-teal/70">{order.user.email}</p>
          <p className="mt-2 text-sm font-bold text-wasabi">
            {order.contact?.shippingMethod === "pickup" ? "Pickup at store" : "Delivery"}
          </p>
          {order.contact?.address && (
            <p className="mt-2 text-teal/70">{order.contact.address}</p>
          )}
          {order.contact?.notes && (
            <p className="mt-2 text-sm text-teal/50">Notes: {order.contact.notes}</p>
          )}
        </div>

        <div className="rounded-3xl border border-sand bg-white/40 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-teal/50">Total</h2>
          <p className="mt-2 text-3xl font-extrabold text-teal">${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-sand bg-white/40">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 border-b border-sand p-6 last:border-b-0"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand">
              {item.image ? (
                <Image
                  src={getProductImageSrc(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <p className="font-bold text-teal">{item.name}</p>
              {formatCustomizations(item.customizations) && (
                <p className="mt-1 text-xs text-teal/50">
                  {formatCustomizations(item.customizations)}
                </p>
              )}
              <p className="mt-1 text-sm text-teal/60">
                {item.quantity} × ${item.unitPrice.toFixed(2)}
              </p>
            </div>
            <p className="font-bold text-teal">${item.subtotal.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
