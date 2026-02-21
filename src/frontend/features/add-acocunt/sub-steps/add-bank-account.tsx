"use client";

import { useGetBank } from "../hooks/use-meroshare-bank";

export default function AddBankAccount({ accountId }: { accountId: string }) {
  const { data, isLoading, isError } = useGetBank(accountId);

  if (isLoading) return <div>Loading bank details...</div>;
  if (isError) return <div>Failed to load bank details.</div>;

  return <div>{JSON.stringify(data)}</div>;
}