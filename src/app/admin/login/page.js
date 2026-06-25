import AdminLoginForm from "@/components/AdminLoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage({ searchParams }) {
  const nextPath = searchParams?.next || "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
          Admin Access
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Sign in to dashboard</h1>
        <p className="mt-3 text-sm text-slate-600">
          Use the admin credentials configured in Vercel.
        </p>

        <AdminLoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
