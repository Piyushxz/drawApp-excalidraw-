"use client"
import { useEffect, useRef } from "react";
import { initDraw } from "../draw";
import ShapeOptionBar from "./ShapeOptionBar";

export default function ClientCanvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log("Mounted");

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }
        initDraw(canvas, roomId, socket);
    }, [canvasRef]);

    return (
        <div
            className="h-[100vh] w-full overflow-hidden "
          
        >   <ShapeOptionBar/>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    );
}
