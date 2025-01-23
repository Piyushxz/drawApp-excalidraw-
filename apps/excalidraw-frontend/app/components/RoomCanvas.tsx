"use client"
import { useEffect, useState} from "react"
import { WS_URL } from "@/config"
import Canvas from "./Canvas"
export default function RoomCanvas({roomId}:{roomId:string}){

    const [socket,setSocket] = useState<WebSocket | null>(null)
    const [loading,setLoading] = useState(true)
    useEffect(()=>{

        const ws = new WebSocket(`${WS_URL}/token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlkZWRiMzE5LThlYWItNDFmMC04ZTNiLTljYTgzNzA3Njk5NSIsImlhdCI6MTczNjkyMDk1N30.8vT_oN-YGmcaQ8bM-Klg7W5O5vM7MFjp94wzQe-tVO0`)
        ws.onopen =()=>{
            setSocket(ws)
            setLoading(false)
            console.log("conncted ws")
            console.log( roomId)
            ws.send(JSON.stringify({
                type:"join_room",
                roomId:roomId
            }))

        }

        return ()=>{
            ws.close()
        }
    }
    ,[])
    if (!socket || loading) {
        return <div className="text-white">Joining...</div>;
    }

    return <Canvas roomId={roomId} socket={socket} />;

}