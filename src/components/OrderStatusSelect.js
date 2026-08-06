"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["Active", "Closed", "Shipped", "Canceled"];

export default function OrderStatusSelect({ orderId, status }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleChange(event) {
    const nextStatus = event.target.value;
    setIsUpdating(true);

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isUpdating}
      onClick={(event) => event.stopPropagation()}
      className="rounded-full border border-sand bg-cream px-3 py-1.5 text-xs font-bold text-teal outline-none focus:border-teal disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
