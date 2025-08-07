'use client'
import { CircleIcon, Pencil, SquareIcon, TriangleIcon } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

export const ShapeLoading = () => {
    const [currentPosition, setCurrentPosition] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPosition((prev) => (prev + 1) % 4)
        }, 600)
        
        return () => clearInterval(interval)
    }, [])

    // Define the 4 positions in a square formation
    const positions = [
        { x: -20, y: -20 },  // Top-left (Rectangle starts here)
        { x: 20, y: -20 },   // Top-right (Triangle position)
        { x: 20, y: 20 },    // Bottom-right (Circle position)
        { x: -20, y: 20 }    // Bottom-left (Pencil position)
    ]

    return (
        <div className="w-screen h-screen dark:bg-black bg-white overflow-hidden">
            {/* Loading animation positioned higher and more to the right */}
            <div className="absolute bottom-20 left-16 flex items-center gap-6">
                <div className="relative">
                    {/* Rectangle - starts at top-left */}
                    <motion.div
                        initial={{ x: positions[0].x, y: positions[0].y }}
                        animate={{
                            x: positions[currentPosition].x,
                            y: positions[currentPosition].y,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                        className="absolute"
                    >
                        <SquareIcon className="size-10 text-foreground" />
                    </motion.div>
                    
                    {/* Triangle - starts at top-right */}
                    <motion.div
                        initial={{ x: positions[1].x, y: positions[1].y }}
                        animate={{
                            x: positions[(currentPosition + 1) % 4].x,
                            y: positions[(currentPosition + 1) % 4].y,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                        className="absolute"
                    >
                        <TriangleIcon className="size-10 text-foreground" />
                    </motion.div>
                    
                    {/* Circle - starts at bottom-right */}
                    <motion.div
                        initial={{ x: positions[2].x, y: positions[2].y }}
                        animate={{
                            x: positions[(currentPosition + 2) % 4].x,
                            y: positions[(currentPosition + 2) % 4].y,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                        className="absolute"
                    >
                        <CircleIcon className="size-10 text-foreground" />
                    </motion.div>
                    
                    {/* Pencil - starts at bottom-left */}
                    <motion.div
                        initial={{ x: positions[3].x, y: positions[3].y }}
                        animate={{
                            x: positions[(currentPosition + 3) % 4].x,
                            y: positions[(currentPosition + 3) % 4].y,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                        className="absolute"
                    >
                        <Pencil className="size-10 text-foreground" />
                    </motion.div>
                </div>
                
                {/* Loading text */}
                <div className="text-base font-medium text-foreground/80 tracking-wide">
                    {/* Joining Room... */}
                </div>
            </div>
        </div>
    )
}