import { Redirect } from "@/components/Redirect"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
export default async function Dashboard(){

    const session = await getServerSession(authOptions)

    console.log(session)
    if(!session?.user){
        return <Redirect to={"/"}/>
    }
    return(
        <div className="text-white">
            dashboard
        </div>
    )
}