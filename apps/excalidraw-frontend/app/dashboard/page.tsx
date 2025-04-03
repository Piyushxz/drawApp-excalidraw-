import { Redirect } from "@/components/Redirect"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { DashboardNavbar } from "@/components/DashboardNavbar"
import DashboardMain from "@/components/DashboardMain"
export default async function Dashboard(){

    const session = await getServerSession(authOptions)

    console.log(session)
    if(!session?.user){
        return <Redirect to={"/"}/>
    }
    return(
        <div>
        <DashboardNavbar/>
        <DashboardMain/>
        </div>

    )
}