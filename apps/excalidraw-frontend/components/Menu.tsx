'use client'
import { HomeIcon, LogOut, MenuIcon, Trash, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./DropDown"
import { DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation"
export const Menu = ()=>{
    const router = useRouter()
    return(
        <div className="fixed top-4 right-4 z-50">

            <DropdownMenu  >
                <DropdownMenuTrigger>
                <button className="border border-white/15 rounded-md dark:bg-[#191919] bg-black p-2 hover:opacity-80 transition-all duration-300">
                    <MenuIcon className="w-6 h-6 dark:text-white text-black" />
                </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent   collisionPadding={{right:12,top:15}} className="w-48 bg-[#191919] border border-white/15">
                <DropdownMenuItem className="w-full flex items-center gap-2 w-full  rounded-sm px-3 py-1.5 text-md outline-none text-white  transition-colors  hover:bg-gray-800 rounded-lg transition-all ease-in-out cursor-pointer">
                    <HomeIcon className="size-5 text-inherit"/>
                    <span className=" font-normal text-md  tracking-tighter text-inherit ">Home</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                 className="w-full flex gap-2 w-full items-center  rounded-sm px-3 py-1.5 text-md outline-none text-white hover:text-red-600 transition-colors  hover:bg-gray-800 rounded-lg transition-all ease-in-out cursor-pointer">
                            <Trash2 className="size-5 text-inherit"/>
                            <span className="font-primary font-normal text-md tracking-tighter text-inherit ">Clear Canvas</span>
                    
                </DropdownMenuItem>
                <DropdownMenuSeparator
                 className="bg-gray-600/30" />
                <DropdownMenuItem  onClick={()=>{
                    router.push('/')
                }}
                 className="w-full flex gap-2 w-full items-center  rounded-sm px-3 py-1.5 text-md outline-none text-white hover:text-red-600 transition-colors  hover:bg-gray-800 rounded-lg transition-all ease-in-out cursor-pointer">
                            <LogOut className="size-5 text-inherit"/>
                            <span className="font-primary font-normal text-md tracking-tighter text-inherit ">Logout</span>
                    
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}