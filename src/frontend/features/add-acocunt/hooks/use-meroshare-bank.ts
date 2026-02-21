import { useQuery } from "@tanstack/react-query";

async function getBank(_id: string) {
  const res = await fetch(`/api/meroshare/bank/${_id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message ?? "Failed to fetch bank");
  return data;
}

const useGetBank = (_id: string) => {
  return useQuery({
    queryKey: ["meroshare-bank", _id],
    queryFn: () => getBank(_id),
    enabled: !!_id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
};

export { useGetBank };
