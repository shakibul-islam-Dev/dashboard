"use client";

import { User, Mail, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useForm, SubmitHandler } from "react-hook-form";
import { registerUser, loginUser, demoLogin } from "@/lib/auth";

type RegistrationInputs = {
  fullName: string;
  email: string;
  password: string;
};

const RegistrationComponents = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInputs>();

  const onSubmit: SubmitHandler<RegistrationInputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = registerUser(data.fullName, data.email, data.password);
    if (!result.ok) {
      toast.error("Registration failed", { description: result.error });
      return;
    }
    loginUser(data.email, data.password);
    toast.success("Account created", {
      description: "Welcome to Task Board!",
    });
    router.push("/dashboard");
  };

  const handleDemoLogin = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const result = demoLogin();
    if (!result.ok) {
      toast.error("Demo login failed", { description: result.error });
      return;
    }
    toast.success("Demo login successful", {
      description: "Welcome to Task Board!",
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
          <h2 className="mt-2 text-xl font-bold text-[#f0f6fc]">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-[#8b949e]">
            Start managing projects efficiently
          </p>
        </section>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Full Name Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="fullName"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8b949e]"
            >
              <User className="h-4 w-4 text-purple-400" />
              <span>Full Name</span>
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              {...register("fullName", {
                required: "Full Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#c9d1d9] outline-none transition-all duration-200 focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
            />
            {errors.fullName && (
              <span className="text-xs text-red-400">
                {errors.fullName.message}
              </span>
            )}
          </div>

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
              placeholder="Create a password"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-linear-to-r from-purple-600 to-pink-600 py-2.5 font-medium text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:from-purple-500 hover:to-pink-500 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Section */}
        <section className="mt-6 text-center text-sm text-[#8b949e]">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors"
            >
              Login
            </Link>
          </p>
        </section>

        {/* Demo Login */}
        <div className="mt-4 pt-4 border-t border-[#30363d]">
          <p className="text-center text-xs text-[#8b949e] mb-3">
            Skip the sign-up and explore instantly.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full rounded-lg border border-[#58a6ff]/40 bg-[#1f2937] py-2.5 text-sm font-medium text-[#58a6ff] transition-all duration-200 hover:bg-[#58a6ff]/10 active:scale-[0.98] cursor-pointer"
          >
            Continue with Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComponents;
