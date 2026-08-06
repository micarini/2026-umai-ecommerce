import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Create Account — Honu Bowls",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-10 text-teal">
      <section className="w-full max-w-md rounded-3xl border border-sand bg-white/40 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-wasabi">
          New here?
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-teal">Create account</h1>
        <p className="mt-3 text-sm text-teal/60">
          Register to save your favorite bowls and track your orders.
        </p>

        <RegisterForm />
      </section>
    </main>
  );
}
