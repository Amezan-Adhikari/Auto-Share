"use client"
import { useQuery } from "@tanstack/react-query";

async function getLatestIPOs() {
  const res = await fetch("/api/latest-ipo");
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

const useGetLatestIPOs = () => {
  return useQuery({
    queryKey: ["latest-ipo"],
    queryFn: getLatestIPOs,
  });
};

export { useGetLatestIPOs };
