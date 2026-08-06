import AdminLoginForm from "@/components/AdminLoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage({ searchParams }) {
  const nextPath = searchParams?.next || "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-10 text-teal">
      <section className="w-full max-w-md rounded-3xl border border-sand bg-white/40 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-wasabi">
          Admin Access
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-teal">Sign in to dashboard</h1>
        <p className="mt-3 text-sm text-teal/60">
          Use the admin credentials configured in Vercel.
        </p>

        <AdminLoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
