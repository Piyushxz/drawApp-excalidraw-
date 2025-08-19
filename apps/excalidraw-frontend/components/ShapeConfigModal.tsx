import { Game, Shape, shapeArrayType } from "@/draw/Game"
import { CaseSensitive, Code, Pencil } from "lucide-react";
import { AnimatePresence } from "motion/react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { BlockPicker } from 'react-color';

interface ShapeConfigModalProps {
    shape: shapeArrayType | undefined,
    showShapeConfigModal: boolean,
    setShowShapeConfigModal: React.Dispatch<React.SetStateAction<boolean>>,
    clickedShapeIndex: number | undefined,
    game: Game | undefined
}

export const ShapeConfigModal = (props: ShapeConfigModalProps) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#ffffff');

    useEffect(() => {
        console.log("ShapeConfigModal useEffect triggered", props.game?.clickedShapeIndex, props.game?.clickedShape)
    }, [props.game?.clickedShapeIndex, props.game?.clickedShape])

    console.log("ShapeConfigModal render", props.showShapeConfigModal, props.game?.clickedShape, 99)

    const handleColorChange = (color: any) => {
        setSelectedColor(color.hex);
        // Here you can update the shape's color in your game
        // For example: props.game?.updateShapeColor(props.clickedShapeIndex, color.hex);
    };

    const handleColorComplete = (color: any) => {
        props.game?.updateShapeColor(props.game?.clickedShapeIndex,color.hex)
        setSelectedColor(color.hex);
        setShowColorPicker(false);
        // Apply the color change to the shape
        // props.game?.updateShapeColor(props.clickedShapeIndex, color.hex);
    };

    const predefinedColors = [
        '#ef4444', // red-500
        '#eab308', // yellow-500
        '#3b82f6', // blue-500
        '#a855f7', // purple-500
        '#f97316', // orange-500
        '#ec4899', // pink-500
    ];

    const handlePredefinedColorClick = (color: string) => {
        setSelectedColor(color);
        // Apply the color change to the shape
        // props.game?.updateShapeColor(props.clickedShapeIndex, color);
    };

    useEffect(()=>{
        return()=>{
            setShowColorPicker(false);
        }
    },[props.showShapeConfigModal])
    return (
        <AnimatePresence mode="popLayout">
            {props.showShapeConfigModal && props.game?.selectedTool !== 'eraser' && (
                <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute left-4 font-satoshi  top-36 -translate-y-1/2 w-64 h-auto bg-[#191919] border border-gray-300/10 rounded-lg shadow-lg z-[100] p-4"
                >
                    <div className="flex flex-col gap-3 justify-between mb-3">
                        <p className="text-white text-sm capitalize font-bold">{props.shape?.shape.type}</p>


                        <div className="flex flex-col gap-1">
                        <p className="text-white text-sm text-white">Stroke</p>
                        <div className="flex gap-2 items-center">
                            {predefinedColors.map((color, index) => (
                                <div
                                    key={index}
                                    className="w-6 h-6 rounded-md cursor-pointer  "
                                    style={{ backgroundColor: color }}
                                    onClick={() =>{
                                        props.game?.updateShapeColor(props.game?.clickedShapeIndex,color)
                                        handlePredefinedColorClick(color)
                                    }}
                                ></div>
                            ))}
                            <div className="w-[1px] h-6 bg-gray-500 rounded-md"></div>
                            <div
                                className="w-6 h-6 rounded-md cursor-pointer hover:scale-110 transition-transform border border-gray-600"
                                style={{ backgroundColor: selectedColor }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            ></div>
                            {showColorPicker &&  (
                                <div className="absolute top-28 left-[142px] z-50">
                                    <BlockPicker color={selectedColor} onChangeComplete={handleColorComplete} />
                                </div>
                            )}


                        </div>
                        </div>


                        <div className="flex flex-col gap-1">
                       
                       {props.shape?.shape.type !== "text" ? (
                        <>
                        <p className="text-white text-sm text-white">Stroke Width</p>
                        <div className="flex items-center gap-2">
                        <div onClick={()=>props.game?.updateShapeStrokeWidth(props.game?.clickedShapeIndex,2)} className={`w-10 h-10 rounded-md bg-white flex items-center px-2 ${props.game?.clickedShape?.strokeWidth === 2 ? "border-2 border-black" : ""}`}>
                                <div className="w-full h-[1px] bg-black/50 rounded-full"></div>
                            </div>
                            <div onClick={()=>props.game?.updateShapeStrokeWidth(props.game?.clickedShapeIndex,4)} className={`w-10 h-10 rounded-md bg-white flex items-center px-2 ${props.game?.clickedShape?.strokeWidth === 3 ? "border-2 border-black" : ""}`}>
                                <div className="w-full h-[3px] bg-black/50 rounded-full"></div> 
                            </div>
                            <div onClick={()=>props.game?.updateShapeStrokeWidth(props.game?.clickedShapeIndex,6)} className={`w-10 h-10 rounded-md bg-white flex items-center px-2 ${props.game?.clickedShape?.strokeWidth === 4 ? "border-2 border-black" : ""}`}>
                                <div className="w-full h-[5px] bg-black/50 rounded-full"></div>
                            </div>
                            </div>
                        </>
                       ) : (
                        <div className="flex flex-col gap-4">
                            {/* Font Size Section */}
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-sm">Font Size</p>
                                <div className="flex gap-2">
                                    <button onClick={()=>{
                                        props.game?.setFontSize(24)
                                        props.game?.updateText(props.game?.clickedShapeIndex,24,(props.game?.clickedShape?.shape as any)?.fontFamily || "Satoshi")
                                    }} title="Small" className="size-8 rounded-md bg-white/60 flex items-center justify-center">
                                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g clip-path="url(#a)"><path d="M14.167 6.667a3.333 3.333 0 0 0-3.334-3.334H9.167a3.333 3.333 0 0 0 0 6.667h1.666a3.333 3.333 0 0 1 0 6.667H9.167a3.333 3.333 0 0 1-3.334-3.334" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg>
                                    </button>
                                    <button onClick={()=>{
                                        props.game?.setFontSize(28)
                                        props.game?.updateText(props.game?.clickedShapeIndex,28,(props.game?.clickedShape?.shape as any)?.fontFamily || "Satoshi")
                                    }} title="Medium" className="size-8 rounded-md bg-white/60 flex items-center justify-center">
                                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g clip-path="url(#a)"><path d="M5 16.667V3.333L10 15l5-11.667v13.334" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg>  
                                    </button>
                                    <button onClick={()=>{
                                        props.game?.setFontSize(32)
                                        props.game?.updateText(props.game?.clickedShapeIndex,32,(props.game?.clickedShape?.shape as any)?.fontFamily || "Satoshi")
                                    }} title="Large" className="size-8 rounded-md bg-white/60 flex items-center justify-center">
                                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g clip-path="url(#a)"><path d="M5.833 3.333v13.334h8.334" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z"></path></clipPath></defs></svg> 
                                    </button>
                                    <button onClick={()=>{
                                        props.game?.setFontSize(36)
                                        props.game?.updateText(props.game?.clickedShapeIndex,36,(props.game?.clickedShape?.shape as any)?.fontFamily || "Satoshi")
                                    }} title="Huge" className="size-8 rounded-md bg-white/60 flex items-center justify-center">
                                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m1.667 3.333 6.666 13.334M8.333 3.333 1.667 16.667M11.667 3.333v13.334h6.666" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></svg>     
                                    </button>
                                </div>
                            </div>

                            {/* Font Family Section */}
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-sm">Font Family</p>
                                <div className="flex gap-2">
                                    <button onClick={()=>{
                                        props.game?.setFont('handwriting')
                                        props.game?.updateText(props.game?.clickedShapeIndex,(props.game?.clickedShape?.shape as any)?.fontSize || 24,props.game?.currentFont)
                                    }} title="Handwriting" className="p-1 rounded-md bg-white/60">
                                        <Pencil className="size-6"/>
                                    </button>
                                    <button onClick={()=>{
                                        props.game?.setFont('code')
                                        props.game?.updateText(props.game?.clickedShapeIndex,(props.game?.clickedShape?.shape as any)?.fontSize || 24,props.game?.currentFont)
                                    }} title="Code" className="p-1 rounded-md bg-white/60 flex items-center justify-center">
                                        <Code className="size-6"/>
                                    </button>
                                    <button onClick={()=>{
                                        props.game?.setFont('normal')
                                        props.game?.updateText(props.game?.clickedShapeIndex,(props.game?.clickedShape?.shape as any)?.fontSize || 24,props.game?.currentFont)
                                    }} title="Normal" className="p-1 rounded-md bg-white/60 flex items-center justify-center">
                                        <CaseSensitive className="size-6"/>       
                                    </button>
                                </div>
                            </div>
                        </div>

                       )
                       }

                        </div>
                        
                        <div>

                        </div>
                        

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}