"use client"
import { useEffect,useRef } from "react"
import { initDraw } from "../draw"
export default function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const cavasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        const canvas = cavasRef.current
     
        if(!canvas){
            return;
        }
        initDraw(canvas,roomId,socket)
    },[cavasRef])
    return(
        <div>
        <canvas ref={cavasRef} width={2000} height={1080}></canvas>
    </div>
    )
}