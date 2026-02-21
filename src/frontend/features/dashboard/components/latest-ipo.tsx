"use client";
import Button from "@/frontend/shared/components/Button";
import { useGetLatestIPOs } from "../hooks/use-ipo";

interface prop {
    account:boolean;
}

export default function LatestIPO({account}:prop) {
    console.log(account);
    const { data, isPending } = useGetLatestIPOs();

  return (
    <div className="p-4 flex gap-10 bg-gray-100 rounded-xl">
      <div className="shrink-0">
        <h1 className="font-[playfairDisplay] font-bold text-lg">
          Latest IPO listing
        </h1>
        <p className="text-sm text-foreground/80 max-w-2xs">
          View the latest applicable Listings from your account
        </p>
      </div>
      <div className="p-2 bg-white flex items-center px-4 w-full shadow-lg rounded-xl">
        {isPending && account && (
            <div>
                Loading...
            </div>
        )}
        {!account && (
          <div className="flex justify-between items-center w-full gap-5 text-sm ">
            <div>
              Oops! it seems you have not added a mero share account yet.
            </div>
            <Button variant="primary" className="text-sm">
              Add Account
            </Button>
          </div>
        )}

        {
            !isPending && account && data && (
                <div>
                    {JSON.stringify(data)}
                </div>
            )
        }

      </div>
    </div>
  );
}
