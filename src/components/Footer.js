import Link from "next/link";

import HonuLogo from "@/components/HonuLogo";

const LINK_COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/", label: "Home" },
      { href: "/categories", label: "Categories" },
      { href: "/favorites", label: "Favorites" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Register" },
      { href: "/user", label: "My orders" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-teal">
      <div className="w-full px-8 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link className="flex items-center" href="/">
              <HonuLogo variant="onDark" height={64} />
            </Link>
            <p className="mt-4 text-sm text-white/60">
              Fresh bowls, your way — wild-caught, organic, and served in compostable bowls.
            </p>
          </div>

          <div className="flex gap-16">
            {LINK_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-bold text-white">{column.title}</p>
                <ul className="mt-4 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-white/60 hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Honu Bowls. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
