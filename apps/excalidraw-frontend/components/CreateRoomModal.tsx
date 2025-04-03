import { AnimatePresence, motion } from "motion/react";
import { Dispatch,SetStateAction } from "react";

export const CreateRoomModal = ({setIsModalOpen}:{setIsModalOpen:Dispatch<SetStateAction<boolean>>}) => {



  return (
    <AnimatePresence>
            <div
      onClick={() =>{()=>{setIsModalOpen(false)
        console.log("clicekd")
       }}}
      className="fixed inset-0 flex  justify-center bg-black/50 z-50"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 200, bounce: 0.3, mass: 0.1, duration: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className="w-80 p-6 rounded-lg h-72 mt-[100px] bg-white shadow-lg font-primary tracking-tight"
      >
        <h1 className="font-semibold text-2xl mb-4">Filter</h1>



      </motion.div>
    </div>
    </AnimatePresence>

  );
};