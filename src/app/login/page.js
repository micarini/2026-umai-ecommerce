import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign In — Sushi Bowl Shop",
};

export default function LoginPage({ searchParams }) {
  const nextPath = searchParams?.next || "/";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
          Welcome back
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-sm text-slate-600">
          Sign in to save your favorites and track your orders.
        </p>

        <LoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
