"use client"
import { useEffect, useRef, useState} from "react"
import { WS_URL } from "@/config"
import { Session } from "next-auth"
import ClientCanvas from "./Canvas"
import { getSession } from "next-auth/react"
export default function RoomCanvas({roomId}:{roomId:string}){

    const [socket,setSocket] = useState<WebSocket | null>(null)
    const sessionRef = useRef<Session | null>(null)
    useEffect(()=>{

        let session = null
        async function  Session(){
             session = await getSession()
             if(session){
                sessionRef.current = session.accessToken
             }
        }

        Session()
        const ws = new WebSocket(`${WS_URL}/?token=${session?.accessToken}`)
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
    if (!socket ) {
        return <div className="text-white">Joining...</div>;
    }

 
    return <div>
             <ClientCanvas roomId={roomId} socket={socket} session={  sessionRef.current} />;

    </div>

}