"use client"
import { initDraw } from "@/app/draw"
import { useEffect, useRef } from "react"
 export default function Canvas(){

    const cavasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        const canvas = cavasRef.current
        if(!canvas){
            return;
        }
        initDraw(canvas)
    }

    ,[cavasRef])
    return(
        <div className="border">
            <canvas  color="white"width={2000} height={1000} ref={cavasRef}></canvas>
        </div>
    )
}