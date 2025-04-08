"use client"
import { useEffect, useRef, useState} from "react"
import { WS_URL } from "@/config"
import { Session } from "next-auth"
import ClientCanvas from "./Canvas"
import { getSession } from "next-auth/react"


export default function RoomCanvas({roomId}:{roomId:string}){

    const [socket,setSocket] = useState<WebSocket | null>(null)
    const [session,setSession] = useState<Session | null>(null)
    useEffect(()=>{

        let ws : WebSocket
        let session = null
        async function  initWebSocket(){
             session = await getSession()
             if(session){
                setSession( session?.accessToken)
                console.log("sessionref",session)
             }
              ws = new WebSocket(`${WS_URL}/?token=${session?.accessToken}`)
             console.log(`${WS_URL}/?token=${session?.accessToken}`)
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



     initWebSocket()

     return()=>{
        ws.close()
       }

    }
    ,[roomId])
    if (!socket ) {
        return <div className="text-white">Joining...</div>;
    }

 
    return <div>
             <ClientCanvas roomId={roomId} socket={socket} session={ session?.accessToken} />;

    </div>

}