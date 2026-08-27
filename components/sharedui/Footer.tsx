import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card px-6 py-6 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <CheckCircle2 className="h-4 w-4 text-primary-foreground stroke-[2.5]" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            TaskBoard
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-foreground"
          >
            Log in
          </Link>
        </div>

        {/* Copyright */}
        <div>© {new Date().getFullYear()} TaskBoard Inc.</div>
      </div>
    </footer>
  );
};

export default Footer;
