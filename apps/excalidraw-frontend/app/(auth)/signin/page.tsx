"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            username,
            password
        });

        if (result?.error) {
            alert("Invalid credentials");
        } else {
            router.push("/dashboard"); // Redirect after login
        }
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="w-[90%] md:w-96 border border-white/15 rounded-lg">
                <div className="w-full py-8 px-5 flex justify-center flex-col">
                    <h1 className="font-bold text-4xl text-white tracking-tighter">Welcome to slapdash!</h1>

                    <form onSubmit={handleFormSubmit} className="pt-10 flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-white tracking-tighter text-sm">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#191919] py-2.5 rounded-md text-white px-1 text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-white tracking-tighter text-sm">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#191919] py-2.5 rounded-md text-white px-1 text-sm"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#191919] py-4 rounded-md text-white tracking-tighter px-1 text-sm hover:opacity-80 transition-all ease-in-out duration-400">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
