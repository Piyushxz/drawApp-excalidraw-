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

// Tooltip content for each tool
const toolTips: Record<Tool, string> = {
  hand: "Pan canvas - Click and drag to move around",
  mouse: "Select & move - Click to select, drag to move shapes",
  rect: "Rectangle - Click and drag to draw",
  circle: "Ellipse - Click and drag to draw",
  pencil: "Freehand - Click and drag to draw freely",
  diamond: "Diamond - Click and drag to draw",
  line: "Line - Click and drag to draw straight line",
  arrow: "Arrow - Click and drag to draw arrow",
  text: "Text - Double click to add text anywhere on the canvas",
  eraser: "Eraser - Click to delete shapes"
};

export default function ShapeOptionBar({
    selectedTool,
    setSelectedTool,
  }: {
    selectedTool: Tool;
    setSelectedTool: React.Dispatch<React.SetStateAction<Tool>>;
  }) {
    return (
      <div className="w-screen flex flex-col items-center">
        <div className="fixed py-1 translate-y-4 bg-[#191919] rounded-lg shadow-lg px-2 border border-gray-600/30 flex items-center gap-1 md:gap-1.5">
        <HandGrab selectedTool={selectedTool}
          size="md"
          onClick={()=>setSelectedTool("hand")}/>
        <Mouse selectedTool={selectedTool}
          size="md"
          onClick={()=>setSelectedTool("mouse")}/>
                    <div className="h-6 md:h-8 border border-white/15"></div>

          <Rectangle
            selectedTool={selectedTool}
            size="md"
            onClick={() => setSelectedTool("rect")}
          />
          <Circle
            selectedTool={selectedTool}
            size="md"
            onClick={() => setSelectedTool("circle")}
          />
          <Pencil
            selectedTool={selectedTool}
            size="md"
            onClick={() => setSelectedTool("pencil")}
          />
            <Diamond
            selectedTool={selectedTool}
            size="md"
            onClick={() => setSelectedTool("diamond")}
          />
            <Line
            selectedTool={selectedTool}
            size="md"
            onClick={() => setSelectedTool("line")}
          />
          <Arrow 
          selectedTool={selectedTool}
          size="md"
          onClick={()=>setSelectedTool("arrow")}

          />
          <Text selectedTool={selectedTool}
          size="md"
          onClick={()=>setSelectedTool("text")}/>
          <div className="h-6 md:h-8 border border-white/15"></div>

          <Eraser selectedTool={selectedTool}
          size="md"
          onClick={()=>setSelectedTool("eraser")}/>
  
        </div>
        <div className="fixed md:translate-y-[75px] translate-y-[60px]">
          <h4 className="flex text-xs text-black/50 dark:text-white/50">
            {toolTips[selectedTool]}
          </h4>
        </div>
      </div>
    );
  }
