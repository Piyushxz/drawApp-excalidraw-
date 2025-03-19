export const Footer = ()=>{
    return(
        <div className="pt-20">
        <div className="w-full flex justify-center border-t border-white/15">
            <div className="w-[80vw] flex justify-none md:justify-between md:flex-row flex-col gap-2 py-14 items-center">
                <div className="flex gap-2 items-center">
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
                <div className="flex gap-8  text-xs md:text-sm">
                    <h5 className="text-white/30 hover:text-white cursor-pointer">Contact</h5>
                    <h5 className="text-white/35 hover:text-white cursor-pointer">Privacy Policy</h5>
                    <h5 className="text-white/35 hover:text-white cursor-pointer">Terms & Condition</h5>


                </div>
            </div>
        </div>
        </div>

    )
}