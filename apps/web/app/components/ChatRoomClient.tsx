"use client"
import { useEffect, useState } from "react"
import { useSocket } from "../../hooks/useSocket";

export default function ChatComponent({ id, messages }: { id: string; messages: { message: string }[] }) {
    const [chats, setChats] = useState(messages)
    console.log("cHA", chats)
    const { socket, loading } = useSocket()
    const [currMessage, setCurrMessage] = useState('')

    const handleSendMessage = () => {
        socket?.send(JSON.stringify({
            type: "chat",
            message: currMessage,
            roomId: id
        }))
        setCurrMessage('')
    }

    useEffect(() => {
        if (socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: Number(id)
            }))

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data)
                if (parsedData.type === "chat") {
                    setChats((prev) => [...prev, { message: parsedData.message }])
                }
            }
        }
    }, [socket, loading, id])

    return (
        <div className="w-[500px] h-[500px] border border-opacity-10">
            <div className="h-[60vh] border-b border-opacity-50 overflow-y-auto">
                {
                    chats.map((chat, index) => (
                        <div className="text-white p-4" key={index}> 
                            {chat.message}
                        </div>
                    ))
                }
            </div>
            <div className="flex gap-2">
                <input
                    onChange={(e) => setCurrMessage(e.target.value)}
                    type="text"
                    className="px-8 py-4 bg-[#191919] text-white w-[50vw]"
                    placeholder="Enter Message"
                    value={currMessage}
                />
                <button
                    onClick={handleSendMessage}
                    className="px-6 py-4 bg-white tracking-tighter font-bold"
                >
                    Send
                </button>
            </div>
        </div>
    )
}
