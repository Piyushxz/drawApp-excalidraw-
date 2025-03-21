import { Header } from "@/components/Header"
import { ReactElement } from "react"

export default function Layout({children}:
    {
        children:ReactElement
    }
){
    return(
        <div>
            <Header/>
            {children}

        </div>
    )
}