"use client";

import { Mail, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useForm, SubmitHandler } from "react-hook-form";
import { loginUser } from "@/lib/auth";

type LoginInputs = {
  email: string;
  password: string;
  remember: boolean;
};

const LoginComponents = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = loginUser(data.email, data.password);
    if (!result.ok) {
      toast.error("Login failed", { description: result.error });
      return;
    }
    toast.success("Login successful", {
      description: "Welcome back to Task Board!",
    });
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] p-4 text-[#c9d1d9]">
      <div className="w-full max-w-md rounded-2xl border border-[#30363d] bg-[#161b22] p-8 shadow-2xl backdrop-blur-sm">
        {/* Header Section */}
        <section className="mb-8 text-center">
          <h1 className="bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-3xl font-extrabold text-transparent">
            Task Board
          </h1>
          <p className="mt-2 text-sm text-[#8b949e]">
            Welcome Back! Please enter your details.
          </p>
        </section>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8b949e]"
            >
              <Mail className="h-4 w-4 text-purple-400" />
              <span>Email</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#c9d1d9] outline-none transition-all duration-200 focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
            />
            {errors.email && (
              <span className="text-xs text-red-400">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8b949e]"
            >
              <LockKeyhole className="h-4 w-4 text-purple-400" />
              <span>Password</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#c9d1d9] outline-none transition-all duration-200 focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
            />
            {errors.password && (
              <span className="text-xs text-red-400">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Remember Password Option */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="remember"
              type="checkbox"
              {...register("remember")}
              className="h-4 w-4 rounded border-[#30363d] bg-[#0d1117] accent-purple-500 focus:ring-0 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm text-[#8b949e] cursor-pointer hover:text-[#c9d1d9] transition-colors"
            >
              Remember Your Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-linear-to-r from-purple-600 to-pink-600 py-2.5 font-medium text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:from-purple-500 hover:to-pink-500 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-[#8b949e]">
          Don&apos;t have an account?{" "}
          <Link
            href="/registration"
            className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors"
          >
            Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponents;
