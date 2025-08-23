"use client"
import axios from "axios";
import { LogIn, Trash2Icon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const RoomCard = ({roomName, createdAt,id }: {
    roomName: string,
    createdAt: string,
    id:string

    
}) => {
    const dateRef = new Date(createdAt)
    const router = useRouter()
    const handleDeleteRoom = async ()=>{

        const loadId = toast.loading(`Deleting ${roomName}`)
        try{
            const session = await getSession()
            const response = await axios.delete('http://13.235.113.13:3008/rooms',{
                data:{id}
                ,
                    headers:{
                        token:session?.accessToken
                    }
                
                
            })

            toast.success("Room Deleted Succesfully")
        }
        catch(e){
            toast.error("Server error")
        }finally{
            toast.dismiss(loadId)
        }
    }
    return (

        <div className="w-96 h-40 border border-white/15 rounded-lg shadow-lg flex flex-col justify-between ">
            <div className="flex justify-between items-center p-4">
                <h3 className="tracking-tighter text-white text-xl font-semibold">{roomName}</h3>
                <Trash2Icon onClick={handleDeleteRoom} className="text-red-600 hover:text-red-600/70 cursor-pointer" size={24} />
            </div>
            <div className="flex justify-between items-center p-4">
                <h3 className="tracking-tight text-white/50 text-sm ">Created {`${dateRef.getDate()}-${dateRef.getMonth()}-${dateRef.getFullYear()}`}</h3>
                <button
                    onClick={()=>router.push(`/canvas/${id}`)} 

                    className="bg-white font-primary text-black flex items-center gap-2 py-2 px-4 rounded-lg hover:opacity-80">
                    <LogIn size={20} />
                    <h3 className="tracking-tight text-black text-sm">Join Room</h3>
                </button>                      
            </div>
        </div>
    );
};
