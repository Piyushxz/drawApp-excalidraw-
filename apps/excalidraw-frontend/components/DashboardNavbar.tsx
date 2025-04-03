import { UserIcon } from "lucide-react"

export const DashboardNavbar=()=>{
    return(
        <header className="w-full flex justify-center border-b border-white/15">
            <div className="w-[95vw]  md:w-[80vw]">
            <div className="flex justify-between items-center   p-2 rounded-lg  ">
                <div className="flex items-center gap-1">
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
          <div className="font-semibold text-3xl text-white tracking-tighter">
                slapdash
          </div>
                </div>




          <div className="flex gap-4 items-center">
          <div className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-[#65e6bf]/40 to-[#65e6bf]/70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user text-white size-4"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          </div>
        </div>
            </div>
        </header>
    )
}