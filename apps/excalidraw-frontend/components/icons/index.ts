import { Tool } from "../ShapeOptionBar"
export interface iconType{
    size:"sm" | "md" | "lg",
    onClick :()=>void,
    selectedTool:Tool,
}

export const iconStyles={
    sm : "w-2" ,
    md :" md:w-6 md:h-6 w-4 h-4",
    lg:"w-8 h-8 "
}