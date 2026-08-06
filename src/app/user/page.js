"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useApp } from "@/context/AppContext";

const STATUS_STYLES = {
  Active: "bg-wasabi-light text-wasabi",
  Closed: "bg-sand text-teal/70",
  Shipped: "bg-teal/10 text-teal",
  Canceled: "bg-salmon/10 text-salmon",
};

export default function UserPage() {
  const router = useRouter();
  const { activeUser } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeUser) {
      router.replace("/login?next=/user");
    }
  }, [activeUser, router]);

  useEffect(() => {
    if (!activeUser) return;

    async function loadOrders() {
      setLoading(true);
      const res = await fetch(`/api/users/${activeUser._id}/orders`);
      if (res.ok) {
        const { orders: userOrders } = await res.json();
        setOrders(userOrders);
      }
      setLoading(false);
    }

    loadOrders();
  }, [activeUser]);

  if (!activeUser) {
    return null;
  }

  return (
    <main className="min-h-screen bg-cream text-teal">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-teal">My Account</h1>

        <div className="mt-6 rounded-3xl border border-sand bg-white/40 p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-teal/50">Name</p>
          <p className="text-lg font-bold text-teal">{activeUser.name}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-teal/50">Email</p>
          <p className="text-teal/70">{activeUser.email}</p>
        </div>

        <h2 className="mt-10 text-xl font-extrabold text-teal">My Orders</h2>

        {loading ? (
          <p className="mt-6 text-teal/50">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-sand p-10 text-center">
            <p className="text-teal/60">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/categories"
              className="mt-4 inline-block rounded-full bg-salmon px-6 py-3 text-sm font-bold text-white transition hover:bg-salmon-dark"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-sand bg-white/40">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/user/order/${order._id}`}
                className="flex items-center justify-between gap-4 border-b border-sand px-6 py-4 last:border-b-0 hover:bg-sand/40"
              >
                <div>
                  <p className="font-bold text-teal">Order {order.orderNumber}</p>
                  <p className="text-xs text-teal/50">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[order.status] || "bg-sand text-teal/70"}`}
                >
                  {order.status}
                </span>
                <p className="font-bold text-teal">${order.total.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
