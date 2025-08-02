import { Game, Shape, shapeArrayType } from "@/draw/Game"
import { AnimatePresence } from "framer-motion"
import { motion } from "motion/react"

interface ShapeConfigModalProps {
    shape: shapeArrayType | undefined,
    showShapeConfigModal: boolean,
    setShowShapeConfigModal: React.Dispatch<React.SetStateAction<boolean>>,
    clickedShapeIndex:number | undefined,
    game:Game | undefined
}


export const ShapeConfigModal = (props: ShapeConfigModalProps) => {

    console.log(props.game?.clickedShape,99)
    return (
        <AnimatePresence>
            {props.showShapeConfigModal && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-4 top-4 w-64 h-auto bg-white border border-gray-300 rounded-lg shadow-lg z-[100] p-4"
                >
                    <div className="flex justify-between items-center mb-3">

                        <p><strong>Type:</strong> {props.shape?.shape.type}</p>
                        <p><strong>ID:</strong> {props.clickedShapeIndex}</p>
                        {props.shape?.shape.type === 'rect' && (
                            <div>
                                <p><strong>Width:</strong> {props.shape.shape.width}</p>
                                <p><strong>Height:</strong> {props.shape.shape.height}</p>
                            </div>
                        )}
                        {props.shape?.shape.type === 'circle' && (
                            <div>
                                <p><strong>Radius:</strong> {props.shape.shape.radius}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}