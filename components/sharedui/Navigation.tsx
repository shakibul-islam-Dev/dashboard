import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="w-full border-b border-border bg-card px-6 py-3.5 shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <CheckCircle2 className="h-5 w-5 text-primary-foreground stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            TaskBoard
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
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
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/login"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/registration"
            className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
