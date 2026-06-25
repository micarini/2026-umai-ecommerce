"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm({ nextPath = "/dashboard" }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid credentials.");
        return;
      }

      router.push(nextPath);
    } catch {
      setMessage("Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <input
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />
      <input
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button
        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </form>
  );
}
