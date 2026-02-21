"use client"
import { useGetMeroShareAccounts } from "@/frontend/shared/hooks/use-mero-share";
import LatestIPO from "./components/latest-ipo";

export default function Dashboard(){
    const {data,isLoading} = useGetMeroShareAccounts();
    // function handleCreateAccount(){
    //     createMeroShareAccount.mutate({
    //         username:"756591",
    //         password:"amejan@1234",
    //         clientId:146
    //     })
    //     }
    console.log(data);
    return(
        <div className="pt-10">
            <LatestIPO account={data?.data.length > 0 ? true : false}/>
            {
                isLoading ? 
                (
                    <div>Loading...</div>
                )
                :
                (
                    <div>
                       {JSON.stringify(data)} 
                    </div>
                )
            }
        </div>
    )

}