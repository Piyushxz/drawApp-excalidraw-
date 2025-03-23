"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import LiquidChrome from "@/components/LiquidChrome";
import {  Code, LayoutDashboard, Sparkles, Pencil } from "lucide-react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        const loadId = toast.loading("Logging in...");
        
        try {
            const result = await signIn("credentials", {
                redirect: false,
                username,
                password,
            });

            toast.dismiss(loadId);

            if (result?.error) {
                toast.error("Invalid credentials");
            } else {
                toast.success("Logged in successfully!");
                router.push("/dashboard");
            }
        } catch (error) {
            toast.dismiss(loadId);
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex justify-center min-h-screen overflow-hidden bg-[#0f0f0f]">
            {/* Background Lucide Icons */}

 
        <Pencil className="absolute top-10 left-16 text-[#65e6bf] opacity-30 w-20 h-20" />

            <Code className="absolute bottom-20 left-40 text-[#65e6bf] opacity-20 w-24 h-24" />
            <LayoutDashboard className="absolute top-20 right-32 text-[#65e6bf] opacity-25 w-16 h-16" />
            <Sparkles className="absolute bottom-10 right-16 text-[#65e6bf] opacity-30 w-20 h-20" />

            <div className="md:w-[80vw] w-[90vw] max-h-auto border border-white/30 rounded-lg mx-2 md:mx-10 my-10 grid grid-cols-12">
                {/* Left Section */}
                <div className="col-span-12 md:col-span-6 flex justify-center items-center p-6">
                    <div className="flex flex-col justify-center gap-6 w-96">
                        <div className="flex flex-col gap-2">
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
                            <h2 className="text-3xl font-semibold text-white tracking-tight">Welcome back</h2>
                            <h2 className="text-md text-white tracking-tight">Please Enter Your Account Details</h2>
                        </div>
                        {/* Input Fields */}
                        <form onSubmit={handleFormSubmit} className="pt-4 flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-white tracking-tighter text-sm">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-[#191919] py-2.5 rounded-md text-white px-3 text-sm"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-white tracking-tighter text-sm">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#191919] py-2.5 rounded-md text-white px-3 text-sm"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-md text-white tracking-tighter text-sm transition-all ease-in-out duration-400 ${
                                    loading ? "bg-gray-700 cursor-not-allowed" : "bg-[#65e6bf] hover:opacity-80"
                                }`}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            <div className="flex justify-center">
                                <h1 className="text-sm text-white/50 tracking-tighter">
                                    Don't have an account?
                                    <Link href="/signup" className="text-white opacity-95 ml-1">Create One</Link>
                                </h1>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Section */}
                <div className="hidden md:flex col-span-12 md:col-span-6 flex items-center justify-center">
                    <div className="translate-y-[-20px] h-[80%] w-[60%] bg-[#65e6bf] rounded-lg flex items-center flex-col justify-center relative">
                        <LiquidChrome baseColor={[0.16, 0.31, 0.29]} speed={0.1} amplitude={0.4} interactive={false} />
                        {/* Positioned Text */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center backdrop-blur-md">
                            <h1 className="md:text-4xl text-2xl font-semibold tracking-tighter text-white/80">Sketch.</h1>
                            <h1 className="md:text-4xl text-2xl font-semibold tracking-tighter text-white/80">Collaborate.</h1>
                            <h1 className="md:text-4xl text-2xl font-semibold tracking-tighter text-white/80">Create.</h1>
                        </div>
                        <div className="shadow-xl translate-y-[30px] translate-x-[10px] rounded-lg w-80 h-48 bg-white flex flex-col justify-center items-center shadow-md relative border border-gray-300">
                    <div className="absolute top-3 left-3 w-16 h-10 border border-dashed border-gray-500"></div>
                    <div className="absolute top-16 right-5 w-10 h-10 border border-dashed border-gray-500 rounded-full"></div>

                    <h1 className="text-lg font-semibold text-gray-800 tracking-tight">slapdash.</h1>
                    <p className="text-xs text-gray-600 text-center px-2">Real-time whiteboard for ideas.</p>
                    </div>                 

   </div>
                </div>
            </div>
        </div>
    );
}
