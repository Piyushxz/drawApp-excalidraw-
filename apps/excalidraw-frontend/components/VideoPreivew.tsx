'use client'
import { motion } from "motion/react";

export const VideoPreivew = ()=>{
    return(
        <div className="w-[100%] flex justify-center ">
        <motion.div 
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1,}}
                    transition={{
                      duration: 1,
                      delay: 0.7,
                      ease: "easeInOut",
                  
                    }}
        className="w-[90vw] md:w-[80vw] lg:w-[70vw] border dark:border-white/20 border-black/50 p-2.5 rounded-xl mt-3">
            <div style={{backgroundImage :`url(/image.png)`}}
            className="aspect-video bg-cover border dark:border-white/20 border-black/50 rounded-lg">

            </div>
        </motion.div>

        </div>
    )
}