'use client'
import { HomeIcon, LogOut, MenuIcon, Monitor, Moon, Sun, Trash, Trash2, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./DropDown"
import { DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { Game } from "@/draw/Game"
import { Dispatch, SetStateAction } from "react"
export const Menu = ({game,setShowClearCanvasModal,setShowLiveCollaborationModal}:{game:Game,setShowClearCanvasModal:Dispatch<SetStateAction<boolean>>,setShowLiveCollaborationModal:Dispatch<SetStateAction<boolean>>})=>{
    const router = useRouter()
    const {theme,toggleTheme,setSystemTheme} = useTheme()

    
    return(
        <div className="fixed top-4 right-4 z-50">

            <DropdownMenu  >
                <DropdownMenuTrigger onClick={() => game.setTool('mouse')}>
                <button className="border border-white/15 rounded-md dark:bg-[#191919] bg-black p-2 hover:opacity-80 transition-all duration-300">
                    <MenuIcon className="w-6 h-6 text-white " />
                </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent   collisionPadding={{right:12,top:15}} className="w-48 bg-[#191919] border border-white/15">
                <DropdownMenuItem className="w-full justify-between flex items-center gap-2 w-full  rounded-sm px-3 py-1.5 text-md outline-none text-white  rounded-lg transition-all ease-in-out cursor-pointer">
                    <span className=" font-normal text-md  tracking-tighter text-inherit ">Theme</span>
                        <div className="flex rounded-xl gap-2 border border-white/15 px-3 py-1">
                            <button title="Light Mode" onClick={(e)=>{
                                e.preventDefault()
                                e.stopPropagation()
                                game.setTheme('light')
                                toggleTheme()}}>
                                
                            <Sun className={`size-6 px-1 rounded-md hover:opacity-80 transition-all duration-300 ${theme === 'light' ? 'bg-white text-black ' : 'text-white'}`} 
                            />
                            </button>

                        <button title="Dark Mode" onClick={(e)=>{
                                                           e.preventDefault()
                                                           e.stopPropagation()
                            game.setTheme('dark')
                            toggleTheme()}}>
                            <Moon className={`size-6 px-1 rounded-md hover:opacity-80 transition-all duration-300 ${theme === 'dark' ? 'bg-white text-black ' : 'text-white'}`} />
                            </button>

                        <button title="System Mode" onClick={(e)=>{
                                   e.preventDefault()
                                   e.stopPropagation()
                            game.setTheme('system')
                            setSystemTheme()}}>
                            <Monitor className={`size-6 px-1 rounded-md hover:opacity-80 transition-all duration-300 ${theme === 'system' ? 'bg-white text-black ' : 'text-white'}`} />
                            </button>

                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator color="f0f0f0"
                 className="bg-white/30 text-white/30" />
                <DropdownMenuItem className="w-full flex items-center gap-2 w-full  rounded-sm px-3 py-1.5 text-md outline-none text-white  transition-colors  hover:bg-gray-800 rounded-lg transition-all ease-in-out cursor-pointer">
                    <HomeIcon className="size-5 text-inherit"/>
                    <span className=" font-normal text-md  tracking-tighter text-inherit ">Home</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>{
                    setShowLiveCollaborationModal(true)
                }} className="w-full flex items-center gap-2 w-full  rounded-sm px-3 py-1.5 text-md outline-none text-white  transition-colors  hover:bg-gray-800 rounded-lg transition-all ease-in-out cursor-pointer">
                    <Users className="size-5 text-inherit"/>
                    <span className=" font-normal text-md  tracking-tighter text-inherit ">Live Collaboration</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>{
                    setShowClearCanvasModal(true)
                }}
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