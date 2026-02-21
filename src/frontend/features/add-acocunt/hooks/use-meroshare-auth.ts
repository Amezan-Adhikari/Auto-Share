import { MeroShareAuthPayload } from "@/shared/types/MeroShareAuth";
import { useMutation } from "@tanstack/react-query";

async function meroShareAuth(payload:MeroShareAuthPayload){
    const res = await fetch("/api/meroshare/token/",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(payload)
    })
    return res.json(); 
}

const useMeroShareAuth =()=>{
    return useMutation({
        mutationFn:meroShareAuth,
    })
};

export {useMeroShareAuth};