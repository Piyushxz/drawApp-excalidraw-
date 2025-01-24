import { Shape } from "../ShapeOptionBar"
export interface iconType{
    size:"sm" | "md" | "lg",
    onClick :()=>void,
    selectedTool:Shape,
}

export const iconStyles={
    sm : "w-2" ,
    md :"w-4",
    lg:"w-8 h-8 "
}