import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import ProductDashboardContainer from "@/containers/ProductDashboardContainer";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/dashboard/products");
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-teal">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard" className="text-sm text-teal/50 hover:text-teal">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold text-teal">Products &amp; Categories</h1>

        <div className="mt-8">
          <ProductDashboardContainer />
        </div>
      </div>
    </main>
  );
}
