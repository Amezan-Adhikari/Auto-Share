"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod/v4";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";
import { Input } from "@/components/ui/input";
import Button from "../../shared/components/Button";

const SignInPayload = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const betterAuthErrors: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password. Please try again.",
  USER_NOT_FOUND: "No account found with this email.",
  INVALID_PASSWORD: "Incorrect password. Please try again.",
  EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  ACCOUNT_LOCKED: "Your account has been locked. Please contact support.",
  TOO_MANY_REQUESTS: "Too many attempts. Please wait a moment and try again.",
};

function getBetterAuthError(error: { code?: string; message?: string }): string {
  if (error.code && betterAuthErrors[error.code]) {
    return betterAuthErrors[error.code];
  }
  return error.message || "Something went wrong. Please try again.";
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const parsed = SignInPayload.safeParse({ email, password });

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });

      setLoading(false);
      return;
    }

    try {
      const res = await authClient.signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
        callbackURL: "/dashboard",
        rememberMe: true,
      });

      if (res?.error) {
        setErrors({ general: getBetterAuthError(res.error) });
      }else{
        toast.success("Logged in successfully!")
      }
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-5 pt-20">
      <form onSubmit={handleLogin} className="w-xl shadow-xl border border-foreground/10 rounded-xl flex flex-col p-4 pt-6 sm:px-10">
        <Link href={"/"} className="self-center">
          <Image height={15} width={120} src={"/Logo.svg"} alt="auto share" />
        </Link>

        <div className="font-[playfairDisplay] mt-8 font-bold text-2xl">
          Login
        </div>

        <p className="text-sm mt-1">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        {errors.general && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="mt-8 space-y-2">
          <label className="text-sm">Email:</label>
          <Input
            type="text"
            className="py-5"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
            placeholder="Email"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm">Password:</label>
          <Input
            type="password"
            className="py-5"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
            placeholder="Password"
          />
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="mt-8 w-max self-end"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}