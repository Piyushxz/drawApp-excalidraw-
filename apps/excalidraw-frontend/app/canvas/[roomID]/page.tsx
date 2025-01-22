"use client"
import { useEffect, useRef } from "react"
 export default function Canvas(){

    const cavasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        const canvas = cavasRef.current
        const ctx = canvas?.getContext('2d')

        ctx?.strokeRect(25,25,100,100);

        let clicked = false;
        let startX =0;
        let startY=0;
        canvas?.addEventListener('mousedown',(e)=>{
            clicked = true;
            startX = e.clientX
            startY = e.clientY
        })

        canvas?.addEventListener('mouseup',e=>{
            clicked = false;
            console.log(e.clientX)
            console.log(e.clientY)
        })
        canvas?.addEventListener('mousemove',(e)=>{
            if(clicked){
                const width = e.clientX - startX;
                const height = e.clientY - startY;

                ctx?.clearRect(0,0,canvas.width,canvas.height)
                ctx?.strokeRect(startX,startY,width,height)
            }
        })
    }

    ,[cavasRef])
    return(
        <div className="border">
            <canvas  color="white"width={500} height={500} ref={cavasRef}></canvas>
        </div>
    )
}