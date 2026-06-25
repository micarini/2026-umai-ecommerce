import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Create Account — Sushi Bowl Shop",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
          New here?
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Create account</h1>
        <p className="mt-3 text-sm text-slate-600">
          Register to save your sushi bowl orders and favorites.
        </p>

        <RegisterForm />
      </section>
    </main>
  );
}
