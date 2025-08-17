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
import { Menu } from "./Menu";
import { useTheme } from "@/contexts/ThemeContext";


export default function ClientCanvas({ roomId, socket,session }: { roomId: string; socket: WebSocket ,session:Session }) {

    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("rect");
    const { theme, toggleTheme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showShapeConfigModal, setShowShapeConfigModal] = useState(false);
    const [shapeSelectionState, setShapeSelectionState] = useState({ index: -1, shape: undefined as any });
    const [showTextInput, setShowTextInput] = useState(false);

    // Theme state
    const [isDark, setIsDark] = useState(theme === 'dark'); // Default to dark mode

    // Zoom and pan state
    const [zoom, setZoom] = useState(100); // Default zoom (100%)
    const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });

    // Tutorial state
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        game?.setTool(selectedTool);
        
    }, [selectedTool]);

    console.log("session", session)
    useEffect(() => {
        if (canvasRef.current ) {
            const g = new Game(canvasRef.current, roomId, socket, setSelectedTool, session, theme);
            setGame(g);

            return () => {
                g.destroy();
            };
        }
    }, [canvasRef]);

    // Show tutorial when canvas mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Showing tutorial...");
            setShowTutorial(true);
        }, 1000); // Increased delay

        return () => clearTimeout(timer);
    }, []);

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

    // Poll for text input state changes
    useEffect(() => {
        if (!game) return;
        
        const interval = setInterval(() => {
            const shouldShowTextInput = game.selectedTool === "text" && game.text.x !== 0 && game.text.y !== 0;
            
            if (shouldShowTextInput !== showTextInput) {
                console.log("Text input state changed:", shouldShowTextInput);
                setShowTextInput(shouldShowTextInput);
            }
        }, 100); // Check every 100ms
        
        return () => clearInterval(interval);
    }, [game, showTextInput]);

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
        <div className={`h-[100vh] w-full overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
            {
                    showTextInput && (
                        <div 
                            className="absolute w-[100px] h-[30px] z-[9999]" 
                            style={{
                                top: `${(game?.text.y || 0) * (zoom / 100) + panOffset.y}px`,
                                left: `${(game?.text.x || 0) * (zoom / 100) + panOffset.x}px`
                            }}
                        >
                            <input 
                                type="text" 
                                className="text-2xl focus:outline-none min-w-auto h-full bg-transparent border-none " 
                                style={{
                                    fontFamily: 'Virgil, sans-serif',
                                    fontSize: `${(game?.fontSize || 24) * (zoom / 100)}px`
                                }}
                                autoFocus
                                ref={(input) => {
                                    if (input) {
                                        input.focus();
                                        input.setSelectionRange(0, 0);
                                    }
                                }}
                                onChange={(e) => {
                                    if (game) {
                                        game.text.text = e.target.value;
                                    }
                                }}
                                onBlur={() => {
                                    if (game) {
                                        game.sendText();
                                        game.text.text = '';
                                        game.text.x = 0;
                                        game.text.y = 0;
                                    }
                                }}
                            />
                        </div>
                    )
            }
            <Menu game={game!}/>
            
            <ShapeOptionBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            <canvas className="" ref={canvasRef}></canvas>
            <PanningOptionBar zoom={zoom} onZoomChange={setZoom} />
            <ShapeConfigModal 
                game={game} 
                clickedShapeIndex={shapeSelectionState.index} 
                shape={shapeSelectionState.shape}
                showShapeConfigModal={showShapeConfigModal}
                setShowShapeConfigModal={setShowShapeConfigModal}
            />

            
            {/* {showTutorial && (
                <div className="z-[9999]">
                    <MultiStepComponent onClose={() => setShowTutorial(false)} />
                </div>
            )} */}
        </div>
    );
} 
