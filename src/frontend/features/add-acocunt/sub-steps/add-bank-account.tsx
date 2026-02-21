"use client";
import { useGetBank } from "../hooks/use-meroshare-bank";
import { MeroShareBankResponse } from "@/server/features/bank/models/MeroShareBank";
import { useRouter } from "next/navigation";
import Button from "@/frontend/shared/components/Button";
import Image from "next/image";
import Link from "next/link";

export default function AddBankAccount({ accountId }: { accountId: string }) {
  const { data, isLoading, isError } = useGetBank(accountId);
  const bankDetail: MeroShareBankResponse = data?.data;
  const router = useRouter();

  return (
    <div className="flex justify-center px-5 pt-20">
      <div className="w-xl shadow-xl border border-foreground/10 rounded-xl flex flex-col p-4 pt-6 sm:px-10">
        <Link href={"/"} className="self-center">
          <Image height={15} width={120} src={"/Logo.svg"} alt="auto share" />
        </Link>

        <div className="font-[playfairDisplay] mt-8 font-bold text-2xl">
          Bank Details
        </div>
        <p className="text-sm mt-1">Your linked bank account</p>

        <div className="mt-8">
          {isLoading ? (
            <div className="border border-foreground/10 rounded-lg p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-foreground/10 rounded w-1/3" />
              <div className="h-6 bg-foreground/10 rounded w-2/3" />
            </div>
          ) : isError || !bankDetail ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
              Failed to load bank details. Please try again.
            </div>
          ) : (
            <div className="border border-foreground/10 rounded-lg p-5 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Bank Name
              </p>
              <p className="text-lg font-semibold">{bankDetail?.name ?? "—"}</p>
            </div>
          )}
        </div>

        <div className="w-max self-end mt-8 flex gap-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
            className="w-max"
          >
            Back
          </Button>
          <Button
            variant="primary"
            type="button"
            disabled={isLoading || isError || !bankDetail}
            onClick={() => router.push("/")}
            className="w-max"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}