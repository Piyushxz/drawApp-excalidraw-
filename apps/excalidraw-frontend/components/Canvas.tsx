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
import { ClearCanvasModal } from "./ClearCanvasModal";
import { LiveCollaborationModal } from "./LiveCollaboration";


export default function ClientCanvas({ roomId, socket,session }: { roomId: string; socket: WebSocket ,session:Session }) {

    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("rect");
    const { theme, toggleTheme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showShapeConfigModal, setShowShapeConfigModal] = useState(false);
    const [shapeSelectionState, setShapeSelectionState] = useState({ index: -1, shape: undefined as any });
    const [showTextInput, setShowTextInput] = useState(false);
    const [showClearCanvasModal, setShowClearCanvasModal] = useState(false);
    const [canvasUpdateTrigger, setCanvasUpdateTrigger] = useState(0); // Force re-render when canvas updates
    const [showLiveCollaborationModal, setShowLiveCollaborationModal] = useState(false);

    // Zoom and pan state
    const [zoom, setZoom] = useState(100); // Default zoom (100%)
    const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });


    useEffect(() => {
        game?.setTool(selectedTool);
        
    }, [selectedTool]);

    useEffect(() => {
        if (canvasRef.current ) {
            const g = new Game(canvasRef.current, roomId, socket, setSelectedTool, session, theme, () => {
                // Callback when canvas is updated
                setCanvasUpdateTrigger(prev => prev + 1);
            });
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
            game.renderCanvas();
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



    // Update shape selection state when canvas updates
    useEffect(() => {
        if (!game) return;
        
        const currentIndex = game.clickedShapeIndex;
        const currentShape = game.clickedShape;
        
        if (currentIndex !== shapeSelectionState.index || currentShape !== shapeSelectionState.shape) {
            console.log("Shape selection changed:", currentIndex, currentShape);
            setShapeSelectionState({ index: currentIndex, shape: currentShape });
            
            if (currentIndex !== undefined && currentIndex !== -1) {
                setShowShapeConfigModal(true);
            } else {
                setShowShapeConfigModal(false);
            }
        }
    }, [canvasUpdateTrigger, game, shapeSelectionState.index, shapeSelectionState.shape]);

    // Update text input state when canvas updates
    useEffect(() => {
        if (!game) return;
        
        const shouldShowTextInput = game.selectedTool === "text" && game.text.x !== 0 && game.text.y !== 0;
        
        if (shouldShowTextInput !== showTextInput) {
            console.log("Text input state changed:", shouldShowTextInput);
            setShowTextInput(shouldShowTextInput);
        }
    }, [canvasUpdateTrigger, game, showTextInput]);

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
                                onKeyDown={(e)=>{
                                    if(e.key === "Enter"){
                                        if (game) {
                                            game.sendText();
                                            game.text.text = '';
                                            game.text.x = 0;
                                            game.text.y = 0;
                                        }
                                    }
                                }}
                            />
                        </div>
                    )
            }
            <Menu game={game!} setShowLiveCollaborationModal={setShowLiveCollaborationModal} setShowClearCanvasModal={setShowClearCanvasModal} />
            
            <ShapeOptionBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            <canvas className="z-[9999]" ref={canvasRef}></canvas>
            <PanningOptionBar zoom={zoom} onZoomChange={setZoom} />
            <ShapeConfigModal 
                game={game} 
                clickedShapeIndex={shapeSelectionState.index} 
                shape={shapeSelectionState.shape}
                showShapeConfigModal={showShapeConfigModal}
                setShowShapeConfigModal={setShowShapeConfigModal}
                canvasUpdateTrigger={canvasUpdateTrigger}
            />
            { showClearCanvasModal &&  <ClearCanvasModal game={game!} setShowClearCanvasModal={setShowClearCanvasModal} showClearCanvasModal={showClearCanvasModal}/>}
            { showLiveCollaborationModal &&  <LiveCollaborationModal game={game!} setShowLiveCollaborationModal={setShowLiveCollaborationModal} showLiveCollaborationModal={showLiveCollaborationModal}/>}
        </div>
    );
} 
