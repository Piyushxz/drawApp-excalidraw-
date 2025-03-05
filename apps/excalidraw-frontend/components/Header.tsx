import { MenuIcon, Sparkle } from "lucide-react"

export const Header = ()=>{
    return(
        <header className="py-2 border-b border-white/15 md:border-none">
            <div className="container">
                <div className="flex justify-between items-center mx-4 md:border md:border-white/15 p-2 rounded-lg   max-w-5xl mx-auto">
                            <div className="p-1.5 rounded-lg border border-white/15">
                                <Sparkle className="size-8 text-white"/>
                            </div>
                            
                            <div className="hidden md:flex">
                                <nav className="flex items-center gap-8 text-sm">
                                    <a href="#" className="text-white tracking-tight text-white/70 hover:text-white transition" >Feature</a>
                                    <a href="#" className="text-white tracking-tight text-white/70 hover:text-white transition">About Us</a>

                                    <a href="#" className="text-white tracking-tight text-white/70 hover:text-white transition">Pricing</a>

                                </nav>
                            </div>
                            <div className="flex gap-4 items-center">
                                    <MenuIcon className="size-8 text-white md:hidden" />
                                    <button className=" font-satoshi text-white tracking-tighter text-sm border border-white/15 rounded-lg px-5 py-2">Upgrade</button>
                            </div>
                </div>
            </div>
        </header>
    )
}