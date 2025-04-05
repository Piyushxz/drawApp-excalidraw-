import axios from "axios";
import { motion } from "motion/react";
import { getSession } from "next-auth/react";
import { Dispatch, SetStateAction, useRef } from "react";
import { toast } from "sonner";

interface CreateRoomModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreateRoomModal = ({ setIsModalOpen }: CreateRoomModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateRoom = async () => {
    const roomName = inputRef.current?.value;

    if (!roomName) {
      toast.error("Please enter a room name");
      return;
    }

    const loadId = toast.loading("Creating room");
    setIsModalOpen(false)
    try {
      const session = await getSession();
      const token = session?.accessToken;
      console.log(token)
      if (!token) {
        throw new Error("No token found");
      }

      await axios.post(
        "http://localhost:3008/createroom",
        { roomName },
        {
          headers: {
            token,
          },
        }
      );

      toast.success("Room created");
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Could not create room");
    } finally {
      toast.dismiss(loadId);
    }
  };

  return (
    <div
      onClick={() => setIsModalOpen(false)}
      className="fixed inset-0 flex h-screen justify-center bg-black/70 z-50"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: "spring",
          stiffness: 200,
          bounce: 0.3,
          mass: 0.1,
          duration: 0.8,
        }}
        onClick={(e) => e.stopPropagation()}
        className="p-2 rounded-lg w-[90vw] md:w-96 bg-black mt-[80px] h-48 border border-gray-600/70 shadow-xl tracking-tight"
      >
        <h1 className="font-primary text-xl tracking-tighter text-white font-semibold px-4 mt-2">
          Create Room
        </h1>
        <h4 className="font-primary text-md text-white text-sm opacity-50 font-normal px-4">
          Please enter a name for your room
        </h4>
        <input
          ref={inputRef}
          type="text"
          className="w-[95%] my-2 mx-4 bg-[#191919] py-2.5 focus:outline-none focus:ring-2 focus:ring-[#65e6bf] rounded-md text-white px-3 text-sm"
          autoComplete="off"
        />
        <div className="flex justify-end gap-4 p-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="flex items-center bg-[#191919] hover:bg-[#191919]/50 border border-white/15 rounded-lg px-4 gap-1 py-2"
          >
            <h1 className="text-sm font-primary text-white">Cancel</h1>
          </button>
          <button
            onClick={handleCreateRoom}
            className="flex items-center bg-[#65e6bf] hover:bg-[#65e6bf]/50 rounded-lg px-4 gap-1 py-2"
          >
            <h1 className="text-sm font-primary text-white">Create</h1>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
