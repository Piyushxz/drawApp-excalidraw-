"use client"
import axios from "axios"
import { 
  Circle, 
  Code, 
  Diamond, 
  Eraser, 
  LayoutDashboard, 
  Pencil, 
  PencilIcon, 
  Pentagon, 
  PlayCircle, 
  Rocket, 
  Sparkles, 
  Square, 
  Triangle, 
  Video,
  Palette,
  MousePointer,
  Move,
  RotateCcw,
  Zap,
  Users,
  Shapes,
  Hand,
  ArrowUpRight,
  Minus,
  Type,
  Image
} from "lucide-react"
import {motion} from "motion/react"
import { useRouter } from "next/navigation"
import {uuid} from "@repo/common/types"
import { BACKEND_URL } from "../config"

export const Hero = ()=>{
  const shapes = [PencilIcon, Circle, Square, Pentagon, Eraser, Diamond, Triangle, Palette, MousePointer, Move, RotateCcw, Users, Hand, ArrowUpRight, Minus, Type, Image, Shapes];
  const duplicatedShapes = [...shapes, ...shapes];

  // Background floating icons
  const floatingIcons = [
    { Icon: Pencil, className: "absolute top-10 left-16 text-[#65e6bf] opacity-30 w-20 h-20", delay: 0.8 },
    { Icon: Code, className: "absolute bottom-20 left-40 text-[#65e6bf] opacity-20 w-24 h-24", delay: 0.5 },
    { Icon: Triangle, className: "absolute top-20 right-32 text-[#65e6bf] opacity-25 w-16 h-16", delay: 0.9 },
    { Icon: Sparkles, className: "absolute bottom-10 right-16 text-[#65e6bf] opacity-20 w-24 h-24", delay: 0.2 },
    { Icon: Palette, className: "absolute top-40 left-10 text-[#65e6bf] opacity-15 w-18 h-18", delay: 1.1 },
    { Icon: Users, className: "absolute bottom-40 right-10 text-[#65e6bf] opacity-25 w-20 h-20", delay: 0.6 },
    { Icon: Shapes, className: "absolute top-60 right-20 text-[#65e6bf] opacity-20 w-16 h-16", delay: 1.3 },
    { Icon: MousePointer, className: "absolute bottom-60 left-20 text-[#65e6bf] opacity-15 w-18 h-18", delay: 0.4 },
  ];

  const router = useRouter()
  const stars = "/stars.png"; 

  const handleCreateRandomRoom = async () => {
    try{
      const response = await axios.post(`${BACKEND_URL}/create-random-room`, {
        adminId: uuid()
      })
      const roomId = response.data.id;
      router.push(`/canvas/${roomId}`);
    }catch(e){
      console.error("Error creating room:", e);
    }
  }

  return(
    <motion.div   
      className="w-full flex justify-center h-full z-10 py-20 dark:bg-black bg-white relative overflow-hidden"
    >
      {/* Animated floating icons */}
      {floatingIcons.map(({ Icon, className, delay }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -20, rotate: -10 }}
          animate={{ 
            opacity: 1, 
            y: [0, -10, 0], 
            rotate: [0, 5, 0]
          }}
          transition={{ 
            opacity: { duration: 0.8, delay },
            y: { 
              repeat: Infinity, 
              duration: 4 + index * 0.5, 
              ease: "easeInOut",
              delay: delay + 1
            },
            rotate: { 
              repeat: Infinity, 
              duration: 6 + index * 0.3, 
              ease: "easeInOut",
              delay: delay + 0.5
            }
          }}
          className={className}
        >
          <Icon className="w-full h-full" />
        </motion.div>
      ))}

      <section className="py-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pt-22 rounded-xl group flex flex-col justify-center items-center"
        >
          {/* Beta badge with enhanced animation */}
          <motion.div 
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              bounce: 0.3, 
              duration: 0.6, 
              delay: 0.3 
            }}
            whileHover={{ scale: 1.05 }}
            className="px-4 rounded-full bg-[#65e6bf]/20 flex gap-2 mb-5 py-2 max-w-fit items-center border border-[#65e6bf]/30 backdrop-blur-sm"
          >
            <motion.div
              // animate={{ rotate: [0, 360] }}
              // transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="size-4 text-[#65e6bf]" />
            </motion.div>
            <h1 className="text-sm font-primary tracking-tighter font-medium text-[#65e6bf]">
              slapdash beta ready to use.
            </h1>
          </motion.div>

          <div className="relative">
            {/* Main title with staggered letter animation */}
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl mt-4 md:text-6xl max-w-sm mx-auto tracking-tighter text-center dark:text-white text-black font-primary font-medium"
            >
              {"slapdash".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.6 + index * 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h2>                      

            {/* Description with slide-up animation */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-center text-lg md:text-xl max-w-xs mx-auto dark:text-white/70 text-black/70 px-4 mt-5 tracking-tighter font-primary"
            >
              A fast, simple, and real-time collaborative drawing tool. Bring ideas to life with ease.
            </motion.p>

            {/* Enhanced button with icon animations */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="flex gap-4 justify-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(101, 230, 191, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateRandomRoom}
                className="inline-flex gap-2 items-center tracking-tighter justify-center dark:bg-white bg-black text-white dark:text-black text-sm hover:opacity-90 transition-all duration-300 h-11 rounded-md px-6 md:px-8 relative overflow-hidden group"
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PencilIcon className="size-4"/>
                </motion.div>
                Start Drawing
                
                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 group-hover:via-white/30"
                />
              </motion.button>
            </motion.div>

            {/* Enhanced scrolling icons section */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="py-10 flex justify-center"
            >
              <div className="container w-[70vw] md:w-[30vw]">
                <div 
                  style={{ 
                    maskImage: "linear-gradient(to right, transparent, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, transparent)" 
                  }}
                  className="flex overflow-hidden pr-5"
                >
                  <motion.div 
                    initial={{ translateX: "0" }}
                    animate={{ translateX: "-50%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 40,
                      ease: "linear"
                    }}
                    className="flex gap-8 flex-none"
                  >
                    {duplicatedShapes.map((Shape, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Shape className="size-8 w-auto dark:text-white/60 text-black/60 hover:text-[#65e6bf] transition-colors duration-300" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}