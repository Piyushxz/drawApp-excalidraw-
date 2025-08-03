import { Game, Shape, shapeArrayType } from "@/draw/Game"
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
            {props.showShapeConfigModal && (
                <motion.div
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute left-4 font-satoshi tracking-tight top-36 -translate-y-1/2 w-64 h-auto bg-[#191919] border border-gray-300/10 rounded-lg shadow-lg z-[100] p-4"
                >
                    <div className="flex flex-col gap-3 justify-between mb-3">
                        <p className="text-white text-sm"><strong>Type:</strong> {props.shape?.shape.type}</p>
                        <div className="flex gap-2 items-center">
                            {predefinedColors.map((color, index) => (
                                <div
                                    key={index}
                                    className="w-6 h-6 rounded-md cursor-pointer hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handlePredefinedColorClick(color)}
                                ></div>
                            ))}
                            <div className="w-[1px] h-6 bg-gray-500 rounded-md"></div>
                            <div
                                className="w-6 h-6 rounded-md cursor-pointer hover:scale-110 transition-transform border border-gray-600"
                                style={{ backgroundColor: selectedColor }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            ></div>
                            {showColorPicker &&  (
                                <div className="absolute top-20 left-[140px] z-50">
                                    <BlockPicker color={selectedColor} onChangeComplete={handleColorComplete} />
                                </div>
                            )}
                        </div>
                        

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}