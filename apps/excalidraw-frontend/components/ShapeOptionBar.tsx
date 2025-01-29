"use client"
import Circle from "./icons/Circle";
import Pencil from "./icons/Pencil";
import Rectangle from "./icons/Rectangle";
import Diamond from "./icons/Diamond";
import { Line } from "./icons/Line";
export type Tool= "rect" | "pencil" | "circle" | "diamond" | "line"



export default function ShapeOptionBar({
    selectedTool,
    setSelectedTool,
  }: {
    selectedTool: Tool;
    setSelectedTool: React.Dispatch<React.SetStateAction<Tool>>;
  }) {
    return (
      <div className="w-screen flex justify-center">
        <div className="fixed h-12 translate-y-8 bg-white rounded-lg shadow-md px-2 border border-white flex items-center gap-2">
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
        </div>
      </div>
    );
  }
