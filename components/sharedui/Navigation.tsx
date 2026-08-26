import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="w-full border-b border-slate-100 bg-white px-6 py-3.5 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0256d0]">
            <CheckCircle2 className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0256d0]">
            TaskBoard
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            href="#features"
            className="transition-colors hover:text-slate-900"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="transition-colors hover:text-slate-900"
          >
            Pricing
          </Link>
          <Link
            href="#documentation"
            className="transition-colors hover:text-slate-900"
          >
            Documentation
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/login"
            className="font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Log in
          </Link>
          <Link
            href="/registration"
            className="rounded-lg bg-[#0256d0] px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-[#0246a8] active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
