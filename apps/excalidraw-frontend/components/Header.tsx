import { MenuIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="py-2 border-b border-white/15 md:border-none   fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center  bg-neutral-950/70 backdrop-blur md:border md:border-white/15 p-2 rounded-lg max-w-5xl mx-auto b  ">
          <div className="p-1.5 rounded-lg border border-white/15">
            <svg
              fill="#65e6bf"
              className="size-8"
              viewBox="-51.2 -51.2 614.40 614.40"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#65e6bf"
            >
              <path d="M188.8,334.07H386.13L279.47,448H83.2Z"></path>
              <path d="M512,199H106.61L0,313H405.39Z"></path>
              <path d="M232.2,64H428.8L322.62,177.93H125.87Z"></path>
            </svg>
          </div>

          <div className="hidden md:flex">
            <nav className="flex items-center gap-8 text-sm">
              <a href="#" className="text-white tracking-tight text-white/70 hover:text-white transition">
                Feature
              </a>
              <a href="#" className="text-white tracking-tight text-white/70 hover:text-white transition">
                About Us
              </a>
              <a href="#" className="text-white tracking-tight text-white/70 hover:text-white transition">
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex gap-4 items-center">
            <MenuIcon className="size-8 text-white md:hidden" />
            <button className="font-satoshi text-white tracking-tighter text-sm border border-white/15 rounded-lg px-5 py-2">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
