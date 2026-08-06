import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllOrders } from "@/lib/orders";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/dashboard/orders");
  }

  const orders = await getAllOrders();

  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-teal">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/dashboard" className="text-sm text-teal/50 hover:text-teal">
              ← Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold text-teal">All Orders</h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="mt-8 text-teal/60">No orders yet.</p>
        ) : (
          <div className="mt-8 overflow-hidden rounded-3xl border border-sand bg-white/40">
            {orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-sand px-6 py-4 last:border-b-0"
              >
                <Link href={`/dashboard/order/${order._id}`} className="min-w-40 hover:underline">
                  <p className="font-bold text-teal">Order {order.orderNumber}</p>
                  <p className="text-xs text-teal/50">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </Link>
                <div className="min-w-40">
                  <p className="text-sm font-medium text-teal">{order.user.name}</p>
                  <p className="text-xs text-teal/50">{order.user.email}</p>
                </div>
                <OrderStatusSelect orderId={order._id} status={order.status} />
                <p className="font-bold text-teal">${order.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
