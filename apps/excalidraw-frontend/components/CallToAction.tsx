"use client";  
import { motion } from "motion/react";
import Image from "next/image";  
import logo from "../public/logo.svg";

export default function CallToAction() {  
    return (
        <div className="w-full flex justify-center">
            <section className="py-10 w-[90vw] md:w-[70vw]">
                <motion.div className="py-24 rounded-xl overflow-hidden relative group">
                    <div
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%2318181b'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
                        }}
                        className="absolute inset-0 bg-[rgb(19, 170, 122)] bg-blend-overlay 
                        [mask-image:radial-gradient(40%_50%_at_50%_45%,black,transparent)] transition duration-700"
                    ></div>

                    <div className="relative text-center">
                    <svg fill="#65e6bf" className="mb-10 w-16 h-16 mx-auto border p-1 border-white/30 rounded-lg" viewBox="-51.2 -51.2 614.40 614.40" xmlns="http://www.w3.org/2000/svg" stroke="#65e6bf"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5_logos</title><path d="M188.8,334.07H386.13L279.47,448H83.2Z"></path><path d="M512,199H106.61L0,313H405.39Z"></path><path d="M232.2,64H428.8L322.62,177.93H125.87Z"></path></g></svg>
                     
                        <h2 className="text-3xl md:text-4xl max-w-sm mx-auto tracking-tight text-white font-primary font-medium">
                        Sketch, Collaborate, Create
                        </h2>
                        
                      
                        <p className="text-sm md:text-md max-w-xs mx-auto text-white/70 px-4 mt-2 tracking-tighter font-primary">
                        Collaborate in real-time, anytime, anywhere.
                        </p>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
