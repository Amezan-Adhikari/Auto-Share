"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod/v4";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";
import { Input } from "@/components/ui/input";
import Button from "../../shared/components/Button";

const SignUpPayload = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const betterAuthErrors: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
  USER_ALREADY_EXISTS: "An account with this email already exists.",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger one.",
  INVALID_EMAIL: "Please enter a valid email address.",
  TOO_MANY_REQUESTS: "Too many attempts. Please wait a moment and try again.",
};

function getBetterAuthError(error: {
  code?: string;
  message?: string;
}): string {
  if (error.code && betterAuthErrors[error.code]) {
    return betterAuthErrors[error.code];
  }
  return error.message || "Something went wrong. Please try again.";
}

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignUp() {
    setErrors({});
    setLoading(true);

    const parsed = SignUpPayload.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      setLoading(false);
      return;
    }

    try {
      const res = await authClient.signUp.email({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (res?.error) {
        setErrors({ general: getBetterAuthError(res.error) });
      } else {
        toast.success("Account created successfully! Redirecting...")
        router.push("/dashboard");
      }
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-5 pt-10 pb-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
        className="w-xl shadow-xl border border-foreground/10 pt-6 rounded-xl flex flex-col p-4 sm:px-10"
      >
        <Link href={"/"} className="self-center">
          <Image height={15} width={120} src={"/Logo.svg"} alt="auto share" />
        </Link>

        <div className="font-[playfairDisplay] mt-6 font-bold text-2xl">
          Create Account
        </div>

        <p className="text-sm mt-1">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>

        {errors.general && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
            {errors.general}
          </div>
        )}

        {/* Name */}
        <div className="mt-8 space-y-2">
          <label className="text-sm">Name:</label>
          <Input
            type="text"
            className="py-5"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Full name"
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="mt-4 space-y-2">
          <label className="text-sm">Email:</label>
          <Input
            type="text"
            className="py-5"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mt-4 space-y-2">
          <label className="text-sm">Password:</label>
          <Input
            type="password"
            className="py-5"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mt-4 space-y-2">
          <label className="text-sm">Confirm Password:</label>
          <Input
            type="password"
            className="py-5"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="mt-8 w-max self-end"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
