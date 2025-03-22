'use client'
import LiquidChrome from "@/components/LiquidChrome";
export default function SignupPage() {
    return (
        <div className="flex justify-center overflow-hidden min-h-screen bg-[#0f0f0f]">
            <div className="overflow-hidden w-[80vw] h-[90vh] border border-white/30 rounded-lg mx-10 my-10 grid grid-cols-12">
                {/* Left Section */}
                <div className=" col-span-12 md:col-span-6 flex justify-center items-center p-6">
                    <div className="flex flex-col justify-center gap-6 w-90">
                        {/* Logo */}
                        <div className="p-2 rounded-lg border border-white/15 flex justify-center items-center w-16 h-16">
                            <svg
                                fill="#65e6bf"
                                className="w-18 h-18"
                                viewBox="-51.2 -51.2 614.40 614.40"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#65e6bf"
                            >
                                <path d="M188.8,334.07H386.13L279.47,448H83.2Z"></path>
                                <path d="M512,199H106.61L0,313H405.39Z"></path>
                                <path d="M232.2,64H428.8L322.62,177.93H125.87Z"></path>
                            </svg>
                        </div>

                        {/* Heading */}
                        <div className="flex flex-col gap-1">
                            <h1 className="font-semibold text-2xl text-white tracking-tight">Get Started</h1>
                            <h2 className="opacity-50 text-md text-white tracking-tight">
                                Welcome to Slapdash – Let's create your account
                            </h2>
                        </div>
                        <div className="my-2 w-90  border border-white/10"></div>
                        {/* Input Fields */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-white tracking-tighter text-sm">Username</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#191919] py-3 px-3 rounded-md text-white text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-[#65e6bf] transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-white tracking-tighter text-sm">Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-[#191919] py-3 px-3 rounded-md text-white text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-[#65e6bf] transition-all"
                                />
                            </div>
                        </div>

                        {/* Signup Button */}
                        <button 
                            type="submit" 
                            className="w-full mt-4 bg-[#65e6bf] text-sm py-3 rounded-md text-white font-medium tracking-tight 
                            hover:bg-[#65e6bf]/80 transition-all duration-300 ease-in-out"
                        >
                            Sign up
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className=" col-span-12 md:col-span-6 border border-white/30 flex items-center justify-center">
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <LiquidChrome
                    baseColor={[0.16, 0.31, 0.29]}
                    speed={0.1}
                    amplitude={0.4}
                    interactive={false}
                />


                
                </div>
                </div>
            </div>
        </div>
    );
}
