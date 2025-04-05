import { Delete, LogIn, Plus, Trash, Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from 'react'
import { RoomCard } from "./RoomCard";

export default function DashboardMain({isModalOpen,setIsModalOpen,roomData}:{isModalOpen:boolean,setIsModalOpen:Dispatch<SetStateAction<boolean>>,roomData:never[]}){
    

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
           
                    {
                        roomData.map(({id,slug,createdAt})=>
                        <RoomCard roomName={slug} createdAt={createdAt} key={id} id={id} />
                        )
                    }
                    
                </div>

            </div>
                
            </section>
  


        </div>
    )
}