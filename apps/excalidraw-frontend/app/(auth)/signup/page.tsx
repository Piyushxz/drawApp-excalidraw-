'use client'
import LiquidChrome from "@/components/LiquidChrome";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../config";
export default function SignupPage() {

    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmal] = useState('')
    const router = useRouter()



    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(!username || !password || !email){
            toast.error("Please Enter the credentials")
        }
        const loadId = toast.loading("Signing Up...")

        try{
            await axios.post(`${BACKEND_URL}/signup`,{
                username,
                email,
                password
            })

            toast.success("Signed Up")
    
            setEmal('')
            setPassword('')
            setUsername('')
            router.push('/signin')
        }catch(err){
            console.log(err)
            toast.error("Could Not sign up")
        }
        finally{
            toast.dismiss(loadId)
        }

    }

    return (
        <div className="flex justify-center  min-h-screen bg-[#0f0f0f]">
            <div className=" md:w-[80vw] w-[90vw] max-h-auto border border-white/30 rounded-lg mx-2 md:mx-10 my-10 grid grid-cols-12">
                {/* Left Section */}
                <div className=" col-span-12 md:col-span-6 flex justify-center items-center p-6">
                    <div className="flex flex-col justify-center gap-6 w-96">
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
                        <h2 className="text-2xl font-semibold text-white tracking-tight">
                                Get Started
                            </h2>
                            <h2 className="opacity-50 text-sm text-white ">
                                Welcome to Slapdash – Let's create your account
                            </h2>
                        </div>
                        <div className="my-2 w-90  border border-white/10"></div>
                        {/* Input Fields */}
                        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                                <label className="text-white tracking-tighter text-sm">Email</label>
                                <input
                                    onChange={(e)=>setEmal(e.target.value)}
                                    value={email}
                                    type="text"
                                    className="w-full bg-[#191919] py-3 px-3 rounded-md text-white text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-[#65e6bf] transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-white tracking-tighter text-sm">Username</label>
                                <input
                                            onChange={(e)=>setUsername(e.target.value)}

                                    value={username}
                                    type="text"
                                    className="w-full bg-[#191919] py-3 px-3 rounded-md text-white text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-[#65e6bf] transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-white tracking-tighter text-sm">Password</label>
                                <input
                                    onChange={(e)=>setPassword(e.target.value)}

                                    value={password}
                                    type="password"
                                    className="w-full bg-[#191919] py-3 px-3 rounded-md text-white text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-[#65e6bf] transition-all"
                                />
                            </div>

                            <button 
                            type="submit" 
                            className="w-full mt-4  bg-gradient-to-r from-[#65e6bf]/40 to-[#65e6bf] text-sm py-3 rounded-md text-white font-medium tracking-tight 
                            hover:bg-[#65e6bf]/30 transition-all duration-300 ease-in-out"
                        >
                            Sign up
                        </button>
                        </form>


                        <div className="flex justify-center">
                        <h1 className=" text-sm text-white/50 tracking-tighter ">Already Have an account ?<Link href="/signin" className="text-white opacity-95  "> Log in </Link></h1>

                        </div>

                    </div>
                </div>

                {/* Right Section */}
                <div className="col-span-12 md:col-span-6 flex items-center justify-center">
                    <div 
                        style={{ width: '100%', height: '95%', position: 'relative', borderRadius: "0.5rem" }} 
                        className="mx-4 rounded-lg  mb-4 md:mb-1 "
                    >
                        <LiquidChrome
                            baseColor={[0.16, 0.31, 0.29]}
                            speed={0.1}
                            amplitude={0.4}
                            interactive={false}
                        />

                        {/* Positioned Text */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center backdrop-blur-md">
                            <h1 className="md:text-4xl text-2xl font-semibold tracking-tighter text-white/80">Sketch.</h1>
                            <h1 className="md:text-4xl text-2xl font-semibold tracking-tighter text-white/80">Collaborate.</h1>
                            <h1 className="md:text-4xl text-2xl font-semibold tracking-tighter text-white/80">Create.</h1>
                        </div>
                    </div>
                    
             
                </div>

            </div>
        </div>
    );
}
