"use client"
import { useRouter } from "next/navigation";
import { useRef } from "react";
export default function(){
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const handleJoinClick = () => {
      if (inputRef.current?.value) {
        router.push(`/room/${inputRef.current.value}`);
      } else {
        alert("Please enter a room name!");
      }
    };
    return(
        <div className="flex flex-col justify-center items-center gap-2">
            <input ref={inputRef}
             type="text" className="px-8 py-4 bg-[#191919] text-white" placeholder="Enter Room"/>
            <button onClick={handleJoinClick} className="px-6 py-4 bg-white tracking-tighter font-bold">Join Room</button>
        </div>
    )
}