"use client";

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <p className="flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-bold text-white">
        <FaCheckCircle className="h-4 w-4" />
        Thanks for subscribing!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full rounded-full border-none bg-white px-5 py-3 text-sm text-teal outline-none placeholder:text-teal/40"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-teal px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-light"
      >
        Subscribe
      </button>
    </form>
  );
}
