import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-100 bg-white px-6 py-6 text-sm text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0256d0]">
            <CheckCircle2 className="h-4 w-4 text-white stroke-[2.5]" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            TaskBoard
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-900"
          >
            Twitter
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-900"
          >
            GitHub
          </a>
          <Link
            href="/privacy"
            className="transition-colors hover:text-slate-900"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-slate-400">
          © {new Date().getFullYear()} TaskBoard Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
