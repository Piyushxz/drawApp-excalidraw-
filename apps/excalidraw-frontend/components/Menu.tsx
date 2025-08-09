import { MenuIcon } from "lucide-react"

export const Menu = ()=>{
    return(
        <div className="fixed top-4 right-4 z-50">

            <button className="border border-white/15 rounded-md dark:bg-[#191919] bg-black p-2 hover:opacity-80 transition-all duration-300">
                <MenuIcon className="w-6 h-6 dark:text-white text-black" />
            </button>
        </div>
    )
}