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
        className="fixed inset-0 flex justify-center bg-black/70 z-50"
      >

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 200, bounce: 0.3, mass: 0.1, duration: 0.8 }}
          onClick={(e) => e.stopPropagation()}
          className="w-80 p-6 rounded-lg h-72 mt-[100px] bg-black border border-gray-600/70  shadow-lg font-primary tracking-tight"
        >
        </motion.div>

      </div>
  );
};
