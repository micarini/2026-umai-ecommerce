import ProductDashboardContainer from "@/containers/ProductDashboardContainer";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import {
  ADMIN_SESSION_COOKIE,
  getExpectedAdminSessionToken,
} from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const endpoints = [
  "GET /api/products",
  "POST /api/products",
  "GET /api/products/:id",
  "PUT /api/products/:id",
  "DELETE /api/products/:id",
  "GET /api/categories",
  "POST /api/categories",
  "GET /api/categories/:id",
  "PUT /api/categories/:id",
  "DELETE /api/categories/:id",
];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const expectedSessionToken = await getExpectedAdminSessionToken().catch(() => null);
  const isAuthenticated = Boolean(sessionToken && expectedSessionToken && sessionToken === expectedSessionToken);

  if (!isAuthenticated) {
    redirect("/admin/login?next=/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-lg bg-slate-900 px-8 py-10 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                Admin Panel
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold">
                Sushi Bowl Management
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                Manage your sushi bowl inventory, categories, and orders with Next.js Route Handlers and MongoDB.
              </p>
            </div>
            <AdminLogoutButton />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {endpoints.map((endpoint) => (
              <span
                key={endpoint}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm"
              >
                {endpoint}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <ProductDashboardContainer />
        </section>
      </div>
    </main>
  );
}
