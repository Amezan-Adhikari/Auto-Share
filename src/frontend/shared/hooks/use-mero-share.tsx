"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


async function getMeroShareAccounts(){
    const res = await fetch("/api/mero-share-user")
    return res.json()
}

interface createParams{
    username:string,
    password:string,
    clientId:number
}
async function createMeroShareAccount({ username, password, clientId }: createParams) {
    const res = await fetch("/api/mero-share-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, clientId })
    });

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

const useGetMeroShareAccounts = ()=>{
    return useQuery({
        queryKey:["mero-share-users"],
        queryFn:getMeroShareAccounts,
        refetchOnWindowFocus:false,
        refetchOnMount:false,
        refetchOnReconnect:false,
        staleTime:1000*60*5,
    })
}


const useCreateMeroShareAccount = ()=>{
    const queryClient = useQueryClient()
    return (
        useMutation({
            mutationFn:createMeroShareAccount,
            onSuccess() {
                queryClient.invalidateQueries({queryKey:["mero-share-users"]})
                toast.success("Account added successfully!")
            },
            onError(error){
                toast.error(error.message)
            }
        },
    )
    )
}

export {useCreateMeroShareAccount,useGetMeroShareAccounts}