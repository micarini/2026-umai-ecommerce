"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useApp } from "@/context/AppContext";
import HonuLogo from "@/components/HonuLogo";

export default function Navbar() {
  const router = useRouter();
  const { activeUser, cartCount, logout } = useApp();

  async function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="border-b border-sand bg-cream">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link className="flex items-center gap-2 text-xl font-bold tracking-tight text-teal" href="/">
          <HonuLogo size={32} />
          Honu Bowls
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/categories", label: "Categories" },
          ].map((link) => (
            <Link
              key={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}

          <Link
            className="rounded-lg px-3 py-2 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
            href="/favorites"
          >
            Favorites
          </Link>

          <Link
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
            href="/cart"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-salmon text-xs font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {activeUser ? (
            <>
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
                href="/user"
              >
                {activeUser.name.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-teal/50 hover:bg-sand hover:text-teal"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="rounded-lg bg-salmon px-4 py-2 text-sm font-semibold text-white hover:bg-salmon-dark"
              href="/login"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
