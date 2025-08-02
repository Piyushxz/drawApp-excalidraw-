import { useEffect, useState } from "react";
import { Game, Point } from "@/draw/Game";

interface UseZoomPanProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  zoom: number;
  setZoom: (zoom: number) => void;
  panOffset: Point;
  setPanOffset: (offset: Point) => void;
  scale: number;
  game: Game | undefined;
}

export const useZoomPan = ({
  canvasRef,
  zoom,
  setZoom,
  panOffset,
  setPanOffset,
  scale,
  game,
}: UseZoomPanProps) => {
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Don't apply transformations here since Game class handles them
    // Just clear the canvas and let the game handle rendering

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 10 : -10;
      const newZoom = Math.min(Math.max(zoom + delta, 30), 200); // Clamped between 50 and 200

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panOffset.x) / scale;
      const mouseY = (e.clientY - rect.top - panOffset.y) / scale;

      const newPanOffset = {
        x: e.clientX - mouseX * (newZoom / 100),
        y: e.clientY - mouseY * (newZoom / 100),
      };

      setPanOffset(newPanOffset);
      setZoom(newZoom);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (game?.selectedTool !== "hand") return;
      setIsPanning(true);
      setStartPoint({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning || game?.selectedTool !== "hand") return;
      setPanOffset({
        x: e.clientX - startPoint.x,
        y: e.clientY - startPoint.y,
      });
    };

    const handleMouseUp = () => setIsPanning(false);

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scale, panOffset, zoom, setZoom, setPanOffset, canvasRef, game, isPanning, startPoint]);
};
  