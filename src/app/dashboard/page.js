import Link from "next/link";
import { redirect } from "next/navigation";

import AdminLogoutButton from "@/components/AdminLogoutButton";
import HonuLogo from "@/components/HonuLogo";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getRecentOrders, getMonthlyTotal } from "@/lib/orders";
import { getRecentUsers } from "@/lib/users";
import { getLowStockProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const STATUS_STYLES = {
  Active: "bg-wasabi-light text-wasabi",
  Closed: "bg-sand text-teal/70",
  Shipped: "bg-teal/10 text-teal",
  Canceled: "bg-salmon/10 text-salmon",
};

export default async function DashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/dashboard");
  }

  const [recentOrders, monthlyTotal, recentUsers, lowStockProducts] = await Promise.all([
    getRecentOrders(5),
    getMonthlyTotal(),
    getRecentUsers(5),
    getLowStockProducts(),
  ]);

  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-teal">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl bg-teal px-8 py-10 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <HonuLogo variant="onDark" height={40} />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-salmon">
                Admin Panel
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold">
                Honu Bowls Dashboard
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/70">
                Overview of orders, customers, and inventory.
              </p>
            </div>
            <AdminLogoutButton />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard/products"
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-bold hover:bg-white/20"
            >
              Manage products &amp; categories
            </Link>
            <Link
              href="/dashboard/orders"
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-bold hover:bg-white/20"
            >
              Manage all orders
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent orders */}
          <section className="rounded-3xl border border-sand bg-white/40 p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold text-teal">Recent Orders</h2>
              <Link href="/dashboard/orders" className="text-sm font-bold text-salmon hover:underline">
                View all
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="mt-4 text-sm text-teal/60">No orders yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order._id}
                    href={`/dashboard/order/${order._id}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-sand px-4 py-3 hover:bg-sand/40"
                  >
                    <div>
                      <p className="text-sm font-bold text-teal">Order {order.orderNumber}</p>
                      <p className="text-xs text-teal/50">{order.user.name}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[order.status] || "bg-sand text-teal/70"}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-sm font-bold text-teal">${order.total.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Monthly total */}
          <section className="rounded-3xl border border-sand bg-white/40 p-6">
            <h2 className="text-xl font-extrabold text-teal">Total Sold This Month</h2>
            <p className="mt-6 text-5xl font-extrabold text-salmon">
              ${monthlyTotal.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-teal/50">
              Sum of all non-canceled orders since the 1st of this month.
            </p>
          </section>

          {/* Recent users */}
          <section className="rounded-3xl border border-sand bg-white/40 p-6">
            <h2 className="text-xl font-extrabold text-teal">Recent Users</h2>

            {recentUsers.length === 0 ? (
              <p className="mt-4 text-sm text-teal/60">No users yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-sand px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-teal">{user.name}</p>
                      <p className="text-xs text-teal/50">{user.email}</p>
                    </div>
                    <p className="text-xs text-teal/40">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Low stock */}
          <section className="rounded-3xl border border-sand bg-white/40 p-6">
            <h2 className="text-xl font-extrabold text-teal">Low Stock</h2>

            {lowStockProducts.length === 0 ? (
              <p className="mt-4 text-sm text-teal/60">Everything is well stocked.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-sand px-4 py-3"
                  >
                    <p className="text-sm font-bold text-teal">{product.name}</p>
                    <span className="rounded-full bg-salmon/10 px-3 py-1 text-xs font-bold text-salmon">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
