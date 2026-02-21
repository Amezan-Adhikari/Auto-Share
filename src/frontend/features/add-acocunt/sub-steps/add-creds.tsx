"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod/v4";
import { Input } from "@/components/ui/input";
import Button from "@/frontend/shared/components/Button";
import { useCreateMeroShareAccount } from "@/frontend/shared/hooks/use-mero-share";
import { toast } from "sonner";
import { DPSelect } from "../components/dp-select";
import { useRouter } from "next/navigation";
import { useMeroShareAuth } from "../hooks/use-meroshare-auth";

const SignInPayload = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  clientId: z.number({ error: "Please select a DP" }),
});

export default function AddCreds() {
  const [username, setUsername] = useState("");
  const [clientId, setClientId] = useState<number>();
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    clientId?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const createMeroShareAccount = useCreateMeroShareAccount();
  const router = useRouter();

  async function handleCreateAccount() {
    setErrors({});
    setLoading(true);

    const parsed = SignInPayload.safeParse({ username, password, clientId });

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        password: fieldErrors.password?.[0],
        clientId: fieldErrors.clientId?.[0],
      });
      setLoading(false);
      return;
    }

    try {
      const accountRes = await createMeroShareAccount.mutateAsync({
        username: parsed.data.username,
        password: parsed.data.password,
        clientId: parsed.data.clientId,
      });

      if (accountRes?.success) {
        toast.success("Account added successfully!");
        router.push(
          "/add-account/add-bank-account?accountId=" + accountRes._id,
        );
      } else {
        throw new Error(accountRes?.message ?? "Failed to create account");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-5 pt-20">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateAccount();
        }}
        className="w-xl shadow-xl border border-foreground/10 rounded-xl flex flex-col p-4 pt-6 sm:px-10"
      >
        <Link href={"/"} className="self-center">
          <Image height={15} width={120} src={"/Logo.svg"} alt="auto share" />
        </Link>

        <div className="font-[playfairDisplay] mt-8 font-bold text-2xl">
          Add Account
        </div>
        <p className="text-sm mt-1">Add a meroshare account</p>

        {errors.general && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="mt-8 space-y-2">
          <label className="text-sm">Select DP</label>
          <DPSelect
            value={clientId}
            onChange={(id) => {
              setClientId(id);
              setErrors((prev) => ({ ...prev, clientId: undefined }));
            }}
            error={errors.clientId}
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm">Username</label>
          <Input
            type="text"
            className="py-5"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-xs text-red-600">{errors.username}</p>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm">Password</label>
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

        <div className="w-max self-end mt-8 flex gap-4">
          <Button
            variant="secondary"
            type="button"
            disabled={loading}
            onClick={() => router.push("/dashboard")}
            className="w-max"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-max"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
