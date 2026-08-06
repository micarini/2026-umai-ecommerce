"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useApp } from "@/context/AppContext";
import OrderDetailView from "@/components/OrderDetailView";

export default function UserOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { activeUser } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!activeUser) {
      router.replace(`/login?next=/user/order/${id}`);
    }
  }, [activeUser, router, id]);

  useEffect(() => {
    if (!activeUser) return;

    async function loadOrder() {
      setLoading(true);
      const res = await fetch(`/api/users/${activeUser._id}/orders/${id}`);
      if (res.ok) {
        const { order: fetchedOrder } = await res.json();
        setOrder(fetchedOrder);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }

    loadOrder();
  }, [activeUser, id]);

  if (!activeUser) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-cream text-teal">
        <div className="mx-auto max-w-3xl px-6 py-10 text-teal/50">Loading order...</div>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen bg-cream text-teal">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-teal">Order not found</h1>
          <Link
            href="/user"
            className="mt-6 rounded-full bg-salmon px-6 py-3 text-sm font-bold text-white transition hover:bg-salmon-dark"
          >
            Back to my orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-teal">
      <OrderDetailView order={order} backHref="/user" backLabel="Back to my orders" />
    </main>
  );
}
