"use client"
import { useEffect, useRef, useState } from "react";
import ShapeOptionBar from "./ShapeOptionBar";
import { Game } from "@/draw/Game";
import { Tool } from "./ShapeOptionBar";
import { PanningOptionBar } from "./PanningOptionBar";
import { useZoomPan } from "@/hooks/usePanning";
import { Point } from "@/draw/Game";
import { Session } from "next-auth";
import { ShapeConfigModal } from "./ShapeConfigModal";


export default function ClientCanvas({ roomId, socket,session }: { roomId: string; socket: WebSocket ,session:Session }) {

    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("rect");

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showShapeConfigModal,setShowShapeConfigModal] = useState(false)
    

    // Zoom and pan state
    const [zoom, setZoom] = useState(100); // Default zoom (100%)
    const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });

    useEffect(() => {
        game?.setTool(selectedTool);
        
    }, [selectedTool]);

    useEffect(() => {
        if (canvasRef.current ) {
            const g = new Game(canvasRef.current, roomId, socket,setSelectedTool,session);
            setGame(g);

            return () => {
                g.destroy();
            };
        }
    }, [canvasRef]);

    // Update game with zoom and pan state
    useEffect(() => {
        if (game) {
            game.updateTransform(zoom, panOffset);
            game.clearCanvas();
        }
    }, [zoom, panOffset, game]);

    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        console.log("Canvas data" , canvasRef.current?.width, canvasRef.current?.height)
        resizeCanvas(); // Initial resize
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);


        console.log(game?.clickedShapeIndex,9999)
    useEffect(()=>{
        if(game?.clickedShapeIndex !== undefined && game?.clickedShapeIndex !== -1){
            setShowShapeConfigModal(true)
        }
        else{
            setShowShapeConfigModal(false)
        }
    },[game?.clickedShapeIndex])
  
    // Hook to manage zoom and pan functionality
    useZoomPan({
        canvasRef,
        zoom,
        setZoom,
        panOffset,
        setPanOffset,
        scale: zoom / 100,
        game:game
    });

    return (
        <div     
              
         className="h-[100vh] w-full overflow-hidden">
            <ShapeOptionBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            <canvas className=""         
             ref={canvasRef}></canvas>
            <PanningOptionBar zoom={zoom} onZoomChange={setZoom} />
            <ShapeConfigModal game={game} clickedShapeIndex={game?.clickedShapeIndex} shape={game?.clickedShape} showShapeConfigModal={showShapeConfigModal} setShowShapeConfigModal={setShowShapeConfigModal} />

        </div>
    );
}
 