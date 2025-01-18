"use client"
import { useState } from "react"
interface Chat {
    id: number;
    message: string;
    roomId: number;
    userId: string;
  }
export default function ChatComponent({ id, messages }: { id: string; messages: Chat[] }) {

    const [chats, setChats] = useState<Chat[]>(messages)

    return (
        <div className="w-[500px] h-[500px] border border-opacity-10">
            <div className="h-[60vh] border-b border-opacity-50 overflow-y-auto">
            {
                chats.map((chat) => (
                    <div className="text-white p-4" key={chat.id}> 
                        {chat.message}
                    </div>
                ))
            }
            </div>
            <div className="flex gap-2">
            <input 
             type="text" className="px-8 py-4 bg-[#191919] text-white w-[50vw]" placeholder="Enter Message"/>
            <button  className="px-6 py-4 bg-white tracking-tighter font-bold">Send</button>
            </div>

        </div>
    )
}
