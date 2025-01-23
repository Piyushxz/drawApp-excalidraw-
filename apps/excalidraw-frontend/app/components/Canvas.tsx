"use client"
import { useRef ,useEffect} from "react"
import { initDraw } from "../draw"
export default function CanvasClient({roomId}:{roomId:string}){
    const cavasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        const canvas = cavasRef.current
        if(!canvas){
            return;
        }
        initDraw(canvas,roomId)
    }

    ,[cavasRef])
    return(
        <div>
            <canvas ref={cavasRef} width={2000} height={1080}></canvas>
        </div>
    )
}