"use client"
import Circle from "./icons/Circle";
import Pencil from "./icons/Pencil";
import Rectangle from "./icons/Rectangle";
import Diamond from "./icons/Diamond";
import { Line } from "./icons/Line";
import { Arrow } from "./icons/Arrow";
import { Eraser } from "./icons/Eraser";
import { Mouse } from "./icons/Mouse";
import { HandGrab } from "./icons/Hand";
import { Text } from "./icons/Text";
export type Tool= "rect" | "pencil" | "circle" | "diamond" | "line" | "arrow" | "eraser" | "mouse" | "hand" | "text"



export default function ShapeOptionBar({
    selectedTool,
    setSelectedTool,
  }: {
    selectedTool: Tool;
    setSelectedTool: React.Dispatch<React.SetStateAction<Tool>>;
  }) {
    return (
      <div className="w-screen  flex justify-center">
        <div className="fixed py-1 translate-y-4 bg-[#191919] rounded-lg shadow-lg px-2 border border-gray-600/30 flex items-center gap-1.5">
        <HandGrab selectedTool={selectedTool}
          size="lg"
          onClick={()=>setSelectedTool("hand")}/>
        <Mouse selectedTool={selectedTool}
          size="lg"
          onClick={()=>setSelectedTool("mouse")}/>
                    <div className="h-8 border border-white/15"></div>

          <Rectangle
            selectedTool={selectedTool}
            size="lg"
            onClick={() => setSelectedTool("rect")}
          />
          <Circle
            selectedTool={selectedTool}
            size="lg"
            onClick={() => setSelectedTool("circle")}
          />
          <Pencil
            selectedTool={selectedTool}
            size="lg"
            onClick={() => setSelectedTool("pencil")}
          />
            <Diamond
            selectedTool={selectedTool}
            size="lg"
            onClick={() => setSelectedTool("diamond")}
          />
            <Line
            selectedTool={selectedTool}
            size="lg"
            onClick={() => setSelectedTool("line")}
          />
          <Arrow 
          selectedTool={selectedTool}
          size="lg"
          onClick={()=>setSelectedTool("arrow")}

          />
          <Text selectedTool={selectedTool}
          size="lg"
          onClick={()=>setSelectedTool("text")}/>
          <div className="h-8 border border-white/15"></div>

          <Eraser selectedTool={selectedTool}
          size="lg"
          onClick={()=>setSelectedTool("eraser")}/>
  
        </div>
      </div>
    );
  }
