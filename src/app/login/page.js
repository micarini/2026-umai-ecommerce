import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign In — Honu Bowls",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const nextPath = params?.next || "/";

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-10 text-teal">
      <section className="w-full max-w-md rounded-3xl border border-sand bg-white/40 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-wasabi">
          Welcome back
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-teal">Sign in</h1>
        <p className="mt-3 text-sm text-teal/60">
          Sign in to save your favorites and track your orders.
        </p>

        <LoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
