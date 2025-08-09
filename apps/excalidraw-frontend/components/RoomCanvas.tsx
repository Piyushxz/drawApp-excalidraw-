"use client"
import { useEffect, useRef, useState} from "react"
import { WS_URL } from "@/config"
import { Session } from "next-auth"
import ClientCanvas from "./Canvas"
import { getSession } from "next-auth/react"
import { motion } from "motion/react"
import { ShapeLoading } from "./ShapeLoading"


export default function RoomCanvas({roomId}:{roomId:string}){

    const [socket,setSocket] = useState<WebSocket | null>(null)
    const [session,setSession] = useState<Session | null>(null)
    const [showCanvas, setShowCanvas] = useState(false)
    
    useEffect(()=>{

        let ws : WebSocket
        let session = null
        async function  initWebSocket(){
             session = await getSession()
             console.log("session",session)
             if(session){
                setSession( session)
             }
             ws = new WebSocket(`${WS_URL}/?token=${session?.accessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'}`)
             console.log(`${WS_URL}/?token=${session?.accessToken}`)
             ws.onopen =()=>{
                 setSocket(ws)
                 console.log("conncted ws")
                 console.log( roomId)    
                 ws.send(JSON.stringify({
                     type:"join_room",
                     roomId:roomId
                 }))
                 
                 // Add delay to show loading animation
                 setTimeout(() => {
                     setShowCanvas(true)
                 }, 1000) // 3 second delay
     
             }
             ws.onclose = () => {
                 console.log("WebSocket connection closed");
               };


 
        }
     initWebSocket()


    }
    ,[roomId])
    
    if (!socket || !showCanvas) {
                return <ShapeLoading/>
    }

 
    return <div>
             <ClientCanvas roomId={roomId} socket={socket} session={session!} />

    </div>

}