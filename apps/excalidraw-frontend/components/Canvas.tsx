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
import ThemeToggle from "./ThemeToggle";


export default function ClientCanvas({ roomId, socket,session }: { roomId: string; socket: WebSocket ,session:Session }) {

    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("rect");

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showShapeConfigModal, setShowShapeConfigModal] = useState(false);
    const [shapeSelectionState, setShapeSelectionState] = useState({ index: -1, shape: undefined as any });

    // Theme state
    const [isDark, setIsDark] = useState(true); // Default to dark mode

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



    // Poll for shape selection changes since Game class doesn't trigger React re-renders
    useEffect(() => {
        if (!game) return;
        
        const interval = setInterval(() => {
            const currentIndex = game.clickedShapeIndex;
            const currentShape = game.clickedShape;
            
            if (currentIndex !== shapeSelectionState.index || currentShape !== shapeSelectionState.shape) {
                console.log("Shape selection changed via polling:", currentIndex, currentShape);
                setShapeSelectionState({ index: currentIndex, shape: currentShape });
                
                if (currentIndex !== undefined && currentIndex !== -1) {
                    setShowShapeConfigModal(true);
                } else {
                    setShowShapeConfigModal(false);
                }
            }
        }, 100); // Check every 100ms
        
        return () => clearInterval(interval);
    }, [game, shapeSelectionState.index, shapeSelectionState.shape]);

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

    // Handle theme toggle
    const handleThemeToggle = (newIsDark: boolean) => {
        setIsDark(newIsDark);
        // Update game theme if game exists
        if (game) {
            game.setTheme(newIsDark);
        }
    };

    return (
        <div className={`h-[100vh] w-full overflow-hidden ${isDark ? 'dark' : ''}`}>
            <ThemeToggle isDark={isDark} onToggle={handleThemeToggle} />
            <ShapeOptionBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            <canvas className="z-[999]" ref={canvasRef}></canvas>
            <PanningOptionBar zoom={zoom} onZoomChange={setZoom} />
            <ShapeConfigModal 
                game={game} 
                clickedShapeIndex={shapeSelectionState.index} 
                shape={shapeSelectionState.shape}
                showShapeConfigModal={showShapeConfigModal}
                setShowShapeConfigModal={setShowShapeConfigModal}
            />
        </div>
    );
}
 