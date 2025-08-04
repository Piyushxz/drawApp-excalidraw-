"use client"
import axios from "axios"
import { Circle, Diamond, Eraser, PencilIcon, Pentagon, PlayCircle, Square, Video } from "lucide-react"
import {motion} from "motion/react"
import { useRouter } from "next/navigation"
import {uuid} from "@repo/common/types"
export const Hero = ()=>{
  const shapes = [PencilIcon, Circle, Square, Pentagon, Eraser, Diamond];
  const duplicatedShapes = [...shapes, ...shapes];

    const router = useRouter()
    const stars = "/stars.png"; 

    const handleCreateRandomRoom = async () => {

      try{
        const response = await axios.post('http://localhost:3008/create-random-room', {
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
        //  animate={{
        //     backgroundPositionX:"100%"
        //   }}
        //   transition={{
        //       repeat:Infinity,
        //       duration:60,
        //       ease:'linear'
        //   }}
        //    style={{backgroundImage:`url(${stars})`}}
        className="w-full flex justify-center h-full z-10 py-20 dark:bg-black bg-white">
     <section 
        className="py-4  ">
          <motion.div

           className="pt-24 rounded-xl   group  ">
              
              <div className="relative">
              <h2 className="text-5xl md:text-6xl max-w-sm mx-auto tracking-tighter text-center dark:text-white text-black font-primary font-medium">
                slapdash
            </h2>                      
          <p className="text-center text-lg md:text-xl  max-w-xs mx-auto dark:text-white/70 text-black/70 px-4 mt-5 tracking-tighter font-primary ">A fast, simple, and real-time collaborative drawing tool. Bring ideas to life with ease.</p>
                  <div className="flex gap-4 justify-center mt-8">
                  <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreateRandomRoom}
                      className="inline-flex  gap-2 items-center tracking-tighter items-center justify-center dark:bg-white bg-black text-white dark:text-black text-sm hover:opacity-80 transition-all duration-300 h-11 rounded-md px-6 md:px-8"
                    >
                        <PencilIcon className="size-4"/>
                      Start Drawing
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/signin')}
                      className="inline-flex  gap-2 items-center tracking-tighter items-center justify-center dark:bg-black dark:text-white bg-white text-black border border-gray-200 dark:border-white/15 text-sm hover:opacity-80 transition-all duration-300 h-11 rounded-md px-6 md:px-8"
                    >
                        <PlayCircle className="size-4"/>
                        Login
                    </motion.button>
                  </div>

                  {/* <section className="py-10 flex justify-center">
                    <div className="container w-[70vw] md:w-[25vw]">
                      <div style={{ maskImage: "linear-gradient(to right, transparent, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, transparent)" }}
                       className="flex  overflow-hidden pr-5 ">
                      <motion.div 
                      initial={{translateX:"0"}}
                      animate={{translateX:'-50%'}}
                      transition={{
                        repeat:Infinity,
                        duration:30,
                        ease:"linear"
                      }}
                      className="flex  gap-8 flex-none">
                      {duplicatedShapes.map((Shape,index)=>(
                          <Shape key={index} className="size-8 w-auto text-white" />
                        ))}
                      </motion.div>
                      </div>
  

                    </div>
                  </section> */}
              </div>

          </motion.div>
        </section>
        </motion.div>
   


    )
}