import { Delete, LogIn, Plus, Trash, Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from 'react'
import { RoomCard } from "./RoomCard";

export default function DashboardMain({isModalOpen,setIsModalOpen}:{isModalOpen:boolean,setIsModalOpen:Dispatch<SetStateAction<boolean>>}){
    

    const handleOpenModal=()=>{
        setIsModalOpen(true)
    }
    return(
        <div className="pt-[50px]">

            <section className="w-full flex justify-center ">
            <div className="w-[95vw]  md:w-[80vw] px-4">

                <div className="flex justify-between items-center">
                    <h3 className="font-semibold tracking-tight text-white text-4xl">Rooms,</h3>
                    <button onClick={handleOpenModal}
                     className="bg-white font-primary text-black flex items-center gap-2 py-2 px-4 rounded-lg hover:opacity-80">
                        <Plus className="size-4"/>
                        <h3 className=" tracking-tight text-black  text-sm">Create Room</h3>
                    </button>
                </div>

                <div className="flex flex-wrap py-10 gap-4">
                    <div className="w-96 h-40 border border-white/15 rounded-lg shadow-lg flex flex-col justify-between ">
                        <div className="flex justify-between items-center p-4">
                        <h3 className=" tracking-tighter text-white  text-xl font-semibold">Room name</h3>
                        <Trash2Icon className="text-red-600 size-6"/>
                        </div>
                        <div className="flex justify-between items-center p-4">
                        <h3 className=" tracking-tight text-white/50  text-sm font-semibold">Created 3/3/2025</h3>
                        <button 
                     className="bg-white font-primary text-black flex items-center gap-2 py-2 px-4 rounded-lg hover:opacity-80">
                        <LogIn className="size-4"/>
                        <h3 className=" tracking-tight text-black  text-sm">Join Room</h3>
                    </button>                        </div>
                    </div>
                    <RoomCard roomName="hey" createdAt="04/03/2025"/>
                    
                </div>

            </div>
                
            </section>
  


        </div>
    )
}