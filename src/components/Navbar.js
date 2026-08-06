"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import { useApp } from "@/context/AppContext";
import HonuLogo from "@/components/HonuLogo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/favorites", label: "Favorites" },
];

export default function Navbar() {
  const router = useRouter();
  const { activeUser, cartCount, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    logout();
    setMobileOpen(false);
    router.push("/");
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="border-b border-sand bg-cream">
      <nav className="flex w-full items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link className="flex items-center" href="/" onClick={closeMobile}>
          <HonuLogo height={44} />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex flex-wrap items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}

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
          </div>

          {activeUser ? (
            <div className="flex items-center gap-2">
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
                href="/user"
              >
                My account
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-teal/50 hover:bg-sand hover:text-teal"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              className="rounded-lg bg-salmon px-4 py-2 text-sm font-semibold text-white hover:bg-salmon-dark"
              href="/login"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="relative rounded-lg p-2 text-teal hover:bg-sand md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          {!mobileOpen && cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-salmon text-[10px] font-bold text-white">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-sand px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
              href={link.href}
              onClick={closeMobile}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
            href="/cart"
            onClick={closeMobile}
          >
            Cart
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-salmon text-xs font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <div className="mt-2 border-t border-sand pt-2">
            {activeUser ? (
              <>
                <Link
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-teal/70 hover:bg-sand hover:text-teal"
                  href="/user"
                  onClick={closeMobile}
                >
                  My account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-teal/50 hover:bg-sand hover:text-teal"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                className="block rounded-lg bg-salmon px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-salmon-dark"
                href="/login"
                onClick={closeMobile}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
