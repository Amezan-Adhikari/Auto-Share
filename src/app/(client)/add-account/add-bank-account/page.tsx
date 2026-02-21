"use client"
import AddBankAccount from "@/frontend/features/add-acocunt/sub-steps/add-bank-account";
import { useSearchParams } from "next/navigation";

export default function Page() {
    
    const params = useSearchParams()
    const accountId = params.get("accountId");

    if(!accountId){
        return (
            <div>
                Invalid Route
            </div>
        )
    }

  return (
    <div>
       <AddBankAccount accountId={accountId}/>
    </div>
  );

}
