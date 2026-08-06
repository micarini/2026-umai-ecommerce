import { notFound, redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrderByIdAdmin } from "@/lib/orders";
import OrderDetailView from "@/components/OrderDetailView";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/dashboard/orders");
  }

  const { id } = await params;
  const order = await getOrderByIdAdmin(id);

  if (!order) notFound();

  return (
    <main className="min-h-screen bg-cream text-teal">
      <OrderDetailView order={order} backHref="/dashboard/orders" backLabel="Back to all orders" admin />
    </main>
  );
}
