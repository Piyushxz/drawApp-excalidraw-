"use client"
import { PencilIcon, Video } from "lucide-react"
import {motion} from "motion/react"
import { useRouter } from "next/navigation"
export const Hero = ()=>{


    const router = useRouter()
    const stars = "/stars.png"; 
    return(
        <motion.div           animate={{
            backgroundPositionX:"100%"
          }}
          transition={{
              repeat:Infinity,
              duration:60,
              ease:'linear'
          }}
           style={{backgroundImage:`url(${stars})`}}
        className="w-full flex justify-center h-screen">
     <section 
        className="py-4  ">
          <motion.div

           className="py-12 rounded-xl overflow-hidden relative group  ">
              
              <div className="relative">
              <h2 className="text-5xl md:text-6xl max-w-sm mx-auto tracking-tight text-center text-white font-primary font-medium">
                slapdash
        </h2>                        <p className="text-center text-lg md:text-xl  max-w-xs mx-auto text-white/70 px-4 mt-5 tracking-tighter font-primary ">Achieve clear , impactful results without the complexity.</p>
                  <div className="flex gap-4 justify-center mt-8">
                  <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/')}
                      className="inline-flex  gap-2 items-center tracking-tighter items-center justify-center bg-white text-black text-sm hover:opacity-80 transition-all duration-300 h-11 rounded-md px-6 md:px-8"
                    >
                        <PencilIcon className="size-4"/>
                      Start Drawing
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/')}
                      className="inline-flex  gap-2 items-center tracking-tighter items-center justify-center bg-black text-white border border-white/15 text-sm hover:opacity-80 transition-all duration-300 h-11 rounded-md px-6 md:px-8"
                    >
                        <Video className="size-4"/>
                        Watch Demo
                    </motion.button>
                  </div>
              </div>

          </motion.div>
        </section>
        </motion.div>
   


    )
}