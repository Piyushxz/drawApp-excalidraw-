"use client"
import { useEffect, useRef, useState } from "react";
import ShapeOptionBar from "./ShapeOptionBar";
import { Game } from "@/draw/Game";
import { Tool } from "./ShapeOptionBar";
export default function ClientCanvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const [game,setGame] = useState<Game>()
    const [selectedTool,setSelectedTool] = useState<Tool>("rect")

    const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log("Mounted");
    useEffect(()=>{
        
        game?.setShape(selectedTool)
    },[selectedTool,game])
    console.log("canvas",selectedTool)
    useEffect(() => {
        if(canvasRef.current){
            const g = new Game(canvasRef.current,roomId,socket)
            setGame(g);


            return ()=>{
                g.destroy()
            }
        }

    }, [canvasRef]);

    return (
        <div
            className="h-[100vh] w-full overflow-hidden "
          
        >   <ShapeOptionBar selectedTool = {selectedTool} setSelectedTool={setSelectedTool}/>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    );
}
