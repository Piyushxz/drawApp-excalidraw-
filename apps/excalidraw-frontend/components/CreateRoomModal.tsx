import { DeleteIcon } from "lucide-react";
import {  motion } from "motion/react";
import { Dispatch, SetStateAction } from "react";


interface CreateRoomModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateRoomModal = ({ setIsModalOpen }: CreateRoomModalProps) => {
  return (
      <div
        onClick={() => {
          setIsModalOpen(false);
          console.log("clicked");
        }}
        className="fixed inset-0 flex h-screen justify-center bg-black/70 z-50"
      >

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 200, bounce: 0.3, mass: 0.1, duration: 0.8 }}
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-lg w-[90vw] md:w-96 bg-black mt-[80px] h-48 border border-gray-600/70 shadow-xl rounded-lg tracking-tight"
        >
            
                <h1 className="font-primary text-xl tracking-tighter text-white font-semibold px-4  mt-2">Create Room</h1>
                <h4 className="font-primary text-md text-white text-sm opacity-50 font-normal px-4 ">Please Enter a name for your room</h4>
                <input
                        type="text"
                                className="w-[95%] my-2 mx-4 bg-[#191919] py-2.5  focus:outline-none focus:ring-2 focus:ring-[#65e6bf] rounded-md text-white px-3 text-sm"
                                autoComplete="off"
                                    />
                <div className="flex justify-end gap-4 p-2">
                <button
                        onClick={()=>{}}
                    
                    className="flex items-center  bg-[#191919] hover:bg-[#191919]/50 border border-white/15 rounded-lg px-4 gap-1 py-2">
                        <h1 className="text-sm font-primary text-white">Cancel</h1>
                    </button>
                    <button
                        onClick={()=>{}}
                    
                    className="flex items-center  bg-[#65e6bf] hover:bg-[#65e6bf]/50 rounded-lg px-4 gap-1 py-2">
                        <h1 className="text-sm font-primary text-white">Create</h1>
                    </button>
                </div>
        </motion.div>

      </div>
  );
};
