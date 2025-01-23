"use client"
import { useEffect, useState} from "react"
import { WS_URL } from "@/config"
import ClientCanvas from "./Canvas"
export default function RoomCanvas({roomId}:{roomId:string}){

    const [socket,setSocket] = useState<WebSocket | null>(null)
    useEffect(()=>{

        const ws = new WebSocket(`${WS_URL}/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlkZWRiMzE5LThlYWItNDFmMC04ZTNiLTljYTgzNzA3Njk5NSIsImlhdCI6MTczNjkyMDk1N30.8vT_oN-YGmcaQ8bM-Klg7W5O5vM7MFjp94wzQe-tVO0`)
        ws.onopen =()=>{
            setSocket(ws)
            console.log("conncted ws")
            console.log( roomId)    
            ws.send(JSON.stringify({
                type:"join_room",
                roomId:roomId
            }))

        }
        ws.onclose = () => {
            console.log("WebSocket connection closed");
          };


    }
    ,[])
    if (!socket) {
        return <div className="text-white">Joining...</div>;
    }

    return <div>
             <ClientCanvas roomId={roomId} socket={socket} />;

    </div>

}