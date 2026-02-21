import Navbar from "@/frontend/features/dashboard/components/navbar";


export default function Layout({children}:Readonly<{children:React.ReactNode}>){
return(
   <div className="container mx-auto max-w-6xl px-5">
        <Navbar/>

        <div>
            {children}
        </div>
    </div>
)
}