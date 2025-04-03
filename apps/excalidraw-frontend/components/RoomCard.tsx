import { LogIn, Trash2Icon } from "lucide-react";

export const RoomCard = ({roomName, createdAt}: {
    roomName: string,
    createdAt: string
}) => {
    return (
        <div className="w-96 h-40 border border-white/15 rounded-lg shadow-lg flex flex-col justify-between ">
            <div className="flex justify-between items-center p-4">
                <h3 className="tracking-tighter text-white text-xl font-semibold">{roomName}</h3>
                <Trash2Icon className="text-red-600" size={24} />
            </div>
            <div className="flex justify-between items-center p-4">
                <h3 className="tracking-tight text-white/50 text-sm font-semibold">Created {createdAt}</h3>
                <button 
                    className="bg-white font-primary text-black flex items-center gap-2 py-2 px-4 rounded-lg hover:opacity-80">
                    <LogIn size={20} />
                    <h3 className="tracking-tight text-black text-sm">Join Room</h3>
                </button>                      
            </div>
        </div>
    );
};
