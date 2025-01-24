"use client"
import { useEffect, useState } from "react";
import Circle from "./icons/Circle";
import Pencil from "./icons/Pencil";
import Rectangle from "./icons/Rectangle";
export type Shape= "rect" | "pencil" | "circle"



export default function ShapeOptionBar() {
    const [selectedTool,setSelectedTool] = useState<Shape>("rect")

    useEffect(()=>{
        //@ts-ignore
        window.selectedTool = selectedTool
    },[selectedTool])
    return (
        <div className="w-screen flex justify-center">
                    <div className="fixed   h-12  translate-y-8 bg-white rounded-lg shadow-md px-2 border border-white flex items-center gap-2 ">
                        <Rectangle selectedTool={selectedTool} size="lg" onClick={()=>setSelectedTool("rect")}/>
                        <Circle selectedTool={selectedTool} size="lg" onClick={()=>setSelectedTool("circle")}/>
                        <Pencil selectedTool={selectedTool }size="lg" onClick={()=>setSelectedTool("pencil")}/>
                    </div>
        </div>

    );
}