import Link from "next/link";

import HonuLogo from "@/components/HonuLogo";

export default function Footer() {
  return (
    <footer className="border-t border-sand bg-cream">
      <div className="flex w-full flex-col gap-6 px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Link className="flex items-center" href="/">
          <HonuLogo height={48} />
        </Link>

        <p className="text-xs text-teal/40">
          © {new Date().getFullYear()} Honu Bowls. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
