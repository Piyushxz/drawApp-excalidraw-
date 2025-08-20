import { Tool } from "@/components/ShapeOptionBar";
import { getExisitingShapes } from "./util";
import { Dispatch, SetStateAction } from 'react'

import axios from "axios";
import { BACKEND_URL } from "@/config";
import { isPointInsidePolygon, isPointNearLine, isPointNearPencilPath } from "./deleteFunctionality";
import { Session } from "next-auth";

export interface shapeArrayType{
    id:number,
    shape:Shape,
    color?:string,
    strokeWidth?:number,
}
export interface Point {
    x:number,
    y:number
}

interface Line{
    P1:{x:number,y:number},
    P2:{x:number,y:number},
}
interface Diamond{
    P1:{x:number,y:number},
    P2:{x:number,y:number},
    P3:{x:number,y:number},
    P4:{x:number,y:number},

}

interface Text{
    text:string,
    x:number,
    y:number,
    fontSize:number,
    fontFamily:string

}
export type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radiusX?: number;
    radiusY?: number;
    // Backward compatibility for older shapes
    radius?: number;
} | {
    type: "pencil";
    points : Point[]
} |
{ 
    type :"diamond";
    x1:number,
    y1:number,
    x2:number,
    y2:number,
    x3:number,
    y3:number,
    x4:number,
    y4:number,
}
|{
    type:'line',
    x1:number,
    y1:number,
    x2:number,
    y2:number
}
|{
   type:'arrow',
   x1:number,
   y1:number,
   x2:number,
   y2:number
}
|{
    type: 'text';
    x: number;
    y: number;
    text: string;
    fontSize:number,
    fontFamily:string
}


export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: shapeArrayType[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private currentMouseX = 0;
    private currentMouseY = 0;
    private pencilPath : Point[] = []
    public selectedTool: Tool = "circle";
    private diamondCoords: Diamond = {P1:{x:0,y:0},P2:{x:0,y:0},P3:{x:0,y:0},P4:{x:0,y:0}};
    private lineCoords : Line = {P1:{x:0,y:0},P2:{x:0,y:0}}
    private arrowCoords : Line = {P1:{x:0,y:0},P2:{x:0,y:0}}
    public clickedShapeIndex:number = -1;
    public clickedShape:shapeArrayType | undefined
    private prevShape:shapeArrayType | undefined
    private setSelectedTool : Dispatch<SetStateAction<Tool>>;
    private session:Session
    private isDarkTheme: boolean = true; // Default to dark theme
    public text:Text = {text:"",x:0,y:0,fontSize:24,fontFamily:"Virgil"}
    public currentFont: string = "Virgil"; // Default font
    public fontSize: number = 24;
    private isDragging = false;
    private dragOffset = { x: 0, y: 0 };

    // Resize state
    private isResizing = false;
    private resizeHandle: string = '';
    private resizeStartData = { width: 0, height: 0, x: 0, y: 0 };

    // Zoom and pan state
    private zoom: number = 100;
    private panOffset: Point = { x: 0, y: 0 };

    socket: WebSocket;
    private onCanvasUpdate?: () => void; // Callback for canvas updates

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, setSelectedTool: Dispatch<SetStateAction<Tool>>, session: Session, initialTheme: 'light' | 'dark' | 'system' = 'dark', onCanvasUpdate?: () => void) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        this.setSelectedTool = setSelectedTool;
        this.session = session;
        this.onCanvasUpdate = onCanvasUpdate;
        
        // Set initial theme based on parameter
        this.isDarkTheme = initialTheme === 'dark' || (initialTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        this.renderCanvas();
        this.updateCursor(); // Set initial cursor
    }

    // Method to update zoom and pan state
    updateTransform(zoom: number, panOffset: Point) {
        this.zoom = zoom;
        this.panOffset = panOffset;
    }

    // Method to set theme
    public setTheme(theme: 'light' | 'dark' | 'system') {
        this.isDarkTheme = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        this.renderCanvas();
    }

    // Method to manually trigger canvas update notification
    public notifyCanvasUpdate() {
        if (this.onCanvasUpdate) {
            this.onCanvasUpdate();
        }
    }

    public setFont(fontType: 'handwriting' | 'code' | 'normal') {
        switch (fontType) {
            case 'handwriting':
                this.currentFont = 'Virgil';
                break;
            case 'code':
                this.currentFont = 'Comic Sans MS';
                break;
            case 'normal':
                this.currentFont = 'Satoshi';
                break;
            default:
                this.currentFont = 'Virgil';
        }
        this.renderCanvas();
    }
    public setFontSize(fontSize: number) {
        this.fontSize = fontSize;
        this.renderCanvas();
    }

    // Transform screen coordinates to canvas coordinates
    private screenToCanvas(screenX: number, screenY: number): Point {
        const scale = this.zoom / 100;
        return {
            x: (screenX - this.panOffset.x) / scale,
            y: (screenY - this.panOffset.y) / scale
        };
    }

    // Transform canvas coordinates to screen coordinates
    private canvasToScreen(canvasX: number, canvasY: number): Point {
        const scale = this.zoom / 100;
        return {
            x: canvasX * scale + this.panOffset.x,
            y: canvasY * scale + this.panOffset.y
        };
    }

    public updateShapeColor(id:number,color:string){
        let shape = this.existingShapes.find(shapeItem => shapeItem.id === id) ;
        if(shape){
            shape.color = color;
            console.log("shape",shape)
        }
        this.renderCanvas();
        this.notifyCanvasUpdate(); // Ensure immediate UI update
        this.socket.send(JSON.stringify({
            type:"update_shape_color",
            id:id,
            shape:shape,
            color:color,
            roomId:this.roomId,
            sentBy : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'
        }))
    }

    public updateText(id:number,fontSize:number,fontFamily:string){
        let shape = this.existingShapes.find(shapeItem => shapeItem.id === id) ;
        if(shape && shape.shape.type === 'text'){
            const textShape = shape.shape as {
                type: 'text';
                x: number;
                y: number;
                text: string;
                fontSize: number;
                fontFamily: string;
            };
            textShape.fontSize = fontSize;
            textShape.fontFamily = fontFamily;
            console.log("shape",shape)
        }
        this.renderCanvas();
        this.notifyCanvasUpdate(); // Ensure immediate UI update
        this.socket.send(JSON.stringify({
            type:"update_shape_text",
            id:id,
            shape:shape,
            roomId:this.roomId,
            sentBy : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'
        }))
    }
    

    public updateShapeStrokeWidth(id:number,strokeWidth:number){
        let shape = this.existingShapes.find(shapeItem => shapeItem.id === id) ;
        if(shape){
            shape.strokeWidth = strokeWidth;
            console.log("shape",shape)
        }
        this.renderCanvas();
        this.notifyCanvasUpdate(); // Ensure immediate UI update
        this.socket.send(JSON.stringify({
            type:"update_shape_stroke_width",
            id:id,
            shape:shape,
            strokeWidth:strokeWidth,
            roomId:this.roomId,
            sentBy : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'
        }))
    }

    // Helper method to draw selection box and resize handles
    private drawSelectionBox() {
        if (!this.clickedShape) return;
        
        const bounds = this.getSelectionBoxBounds();
        if (!bounds) return;
        
        const width = bounds.maxX - bounds.minX;
        const height = bounds.maxY - bounds.minY;
        
        // Draw selection box (dashed border)
        this.ctx.strokeStyle = "#0096FF";
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([4, 4]);
        this.ctx.strokeRect(bounds.minX, bounds.minY, width, height);
        this.ctx.setLineDash([]);
        
        // Draw resize handles
        this.drawResizeHandles(bounds.minX, bounds.minY, width, height);
    }

    // Helper method to draw resize handles
    private drawResizeHandles(x: number, y: number, width: number, height: number) {
        const handleSize = 6; // Smaller handles like Excalidraw
        const handleColor = "#0096FF";
        const handleFillColor = "#ffffff";
        const handleOffset = 2;
        
        this.ctx.fillStyle = handleFillColor;
        this.ctx.strokeStyle = handleColor;
        this.ctx.lineWidth = 1.5;
        
        // Corner handles only (4 handles)
        const handles = [
            { x: x - handleOffset, y: y - handleOffset }, // nw
            { x: x + width - handleSize + handleOffset, y: y - handleOffset }, // ne
            { x: x + width - handleSize + handleOffset, y: y + height - handleSize + handleOffset }, // se
            { x: x - handleOffset, y: y + height - handleSize + handleOffset } // sw
        ];
        
        handles.forEach(handle => {
            // Draw handle with rounded corners (like Excalidraw)
            this.ctx.beginPath();
            this.ctx.roundRect(handle.x, handle.y, handleSize, handleSize, 2);
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    // Helper method to draw rounded rectangle
    private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number = 8) {
        // Handle negative width/height by adjusting coordinates
        const actualX = width < 0 ? x + width : x;
        const actualY = height < 0 ? y + height : y;
        const actualWidth = Math.abs(width);
        const actualHeight = Math.abs(height);
        
        // Ensure radius doesn't exceed half the smallest dimension
        const maxRadius = Math.min(actualWidth, actualHeight) / 2;
        const finalRadius = Math.min(radius, maxRadius);
        
        this.ctx.beginPath();
        this.ctx.moveTo(actualX + finalRadius, actualY);
        this.ctx.lineTo(actualX + actualWidth - finalRadius, actualY);
        this.ctx.quadraticCurveTo(actualX + actualWidth, actualY, actualX + actualWidth, actualY + finalRadius);
        this.ctx.lineTo(actualX + actualWidth, actualY + actualHeight - finalRadius);
        this.ctx.quadraticCurveTo(actualX + actualWidth, actualY + actualHeight, actualX + actualWidth - finalRadius, actualY + actualHeight);
        this.ctx.lineTo(actualX + finalRadius, actualY + actualHeight);
        this.ctx.quadraticCurveTo(actualX, actualY + actualHeight, actualX, actualY + actualHeight - finalRadius);
        this.ctx.lineTo(actualX, actualY + finalRadius);
        this.ctx.quadraticCurveTo(actualX, actualY, actualX + finalRadius, actualY);
        this.ctx.closePath();
        this.ctx.stroke();
    }



    // Method to draw preview shapes with transformations
    private drawPreview() {
        // Apply transformations for preview drawing
        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);
        this.ctx.scale(this.zoom / 100, this.zoom / 100);
        
        this.ctx.strokeStyle = this.isDarkTheme ? "rgba(255, 255, 255)" : "rgba(0, 0, 0)";
        this.ctx.lineWidth = 1;
        
        const selectedTool = this.selectedTool;
        const width = this.currentMouseX - this.startX;
        const height = this.currentMouseY - this.startY;
        
        if (selectedTool === "rect") {
            this.drawRoundedRect(this.startX, this.startY, width, height);   
        } else if (selectedTool === "circle") {
            // Excalidraw-like ellipse (fits the drag rectangle)
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            const rx = Math.abs(width) / 2;
            const ry = Math.abs(height) / 2;
            this.ctx.beginPath();
            this.ctx.ellipse(centerX, centerY, rx, ry, 0, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();                
        } else if(selectedTool === 'pencil'){
            this.ctx.beginPath();
            for (let i = 0; i < this.pencilPath.length - 1; i++) {
                this.ctx.moveTo(this.pencilPath[i].x, this.pencilPath[i].y);
                this.ctx.lineTo(this.pencilPath[i + 1].x, this.pencilPath[i + 1].y);
            }
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.closePath();
        } else if(selectedTool === 'diamond'){
            // Calculate diamond points correctly
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;
            const x1 = centerX; // Top
            const y1 = this.startY;
            const x2 = this.startX + width; // Right
            const y2 = centerY;
            const x3 = centerX; // Bottom
            const y3 = this.startY + height;
            const x4 = this.startX; // Left
            const y4 = centerY;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineTo(x3, y3);
            this.ctx.lineTo(x4, y4);
            this.ctx.closePath();
            this.ctx.stroke();
        } else if(selectedTool === 'line'){
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX,this.startY)
            this.ctx.lineTo(this.currentMouseX,this.currentMouseY)
            this.ctx.stroke();
        } else if(selectedTool === 'arrow'){
            const headlen = 14; // Length of arrowhead
            const angle = Math.atan2(this.currentMouseY - this.startY, this.currentMouseX - this.startX);
        
            this.ctx.beginPath();
            this.ctx.lineCap = "round";
            this.ctx.lineWidth = 2.5; // Adjust for better visibility
        
            // Draw main line
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(this.currentMouseX, this.currentMouseY);
            
            // Calculate arrowhead points
            const arrowX1 = this.currentMouseX - headlen * Math.cos(angle - Math.PI / 6);
            const arrowY1 = this.currentMouseY - headlen * Math.sin(angle - Math.PI / 6);
            const arrowX2 = this.currentMouseX - headlen * Math.cos(angle + Math.PI / 6);
            const arrowY2 = this.currentMouseY - headlen * Math.sin(angle + Math.PI / 6);
            
            // Draw arrowhead
            this.ctx.moveTo(this.currentMouseX, this.currentMouseY);
            this.ctx.lineTo(arrowX1, arrowY1);
            
            this.ctx.moveTo(this.currentMouseX, this.currentMouseY);
            this.ctx.lineTo(arrowX2, arrowY2);
        
            this.ctx.stroke();
        }
        
        // Restore transformations
        this.ctx.restore();
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
        if(this.selectedTool !== 'arrow'){
            this.clickedShape = undefined;
            this.clickedShapeIndex = -1;
        }
        this.updateCursor();
    }

    // Method to get selection box bounds
    private getSelectionBoxBounds(): { minX: number; minY: number; maxX: number; maxY: number } | null {
        if (!this.clickedShape) return null;
        
        const shape = this.clickedShape.shape;
        const padding = 8;
        
        if (shape.type === "rect") {
            const actualX = shape.width < 0 ? shape.x + shape.width : shape.x;
            const actualY = shape.height < 0 ? shape.y + shape.height : shape.y;
            const actualWidth = Math.abs(shape.width);
            const actualHeight = Math.abs(shape.height);
            
            return {
                minX: actualX - padding,
                minY: actualY - padding,
                maxX: actualX + actualWidth + padding,
                maxY: actualY + actualHeight + padding
            };
        } else if (shape.type === "circle") {
            const rx = Math.abs(shape.radiusX ?? shape.radius ?? 0);
            const ry = Math.abs(shape.radiusY ?? shape.radius ?? 0);
            
            return {
                minX: shape.centerX - rx - padding,
                minY: shape.centerY - ry - padding,
                maxX: shape.centerX + rx + padding,
                maxY: shape.centerY + ry + padding
            };
        } else if (shape.type === "diamond") {
            return {
                minX: Math.min(shape.x1, shape.x2, shape.x3, shape.x4) - padding,
                minY: Math.min(shape.y1, shape.y2, shape.y3, shape.y4) - padding,
                maxX: Math.max(shape.x1, shape.x2, shape.x3, shape.x4) + padding,
                maxY: Math.max(shape.y1, shape.y2, shape.y3, shape.y4) + padding
            };
        } else if (shape.type === "line" || shape.type === "arrow") {
            return {
                minX: Math.min(shape.x1, shape.x2) - padding,
                minY: Math.min(shape.y1, shape.y2) - padding,
                maxX: Math.max(shape.x1, shape.x2) + padding,
                maxY: Math.max(shape.y1, shape.y2) + padding
            };
        } else if (shape.type === "pencil") {
            if (shape.points.length > 0) {
                return {
                    minX: Math.min(...shape.points.map(p => p.x)) - padding,
                    minY: Math.min(...shape.points.map(p => p.y)) - padding,
                    maxX: Math.max(...shape.points.map(p => p.x)) + padding,
                    maxY: Math.max(...shape.points.map(p => p.y)) + padding
                };
            }
        } else if (shape.type === "text") {
            // Use actual font size for bounding box calculation to keep it consistent with zoom
            this.ctx.font = `${shape.fontSize}px ${shape.fontFamily}, sans-serif`;
            const textMetrics = this.ctx.measureText(shape.text);
            const textWidth = textMetrics.width;
            const textHeight = shape.fontSize;
            
            return {
                minX: shape.x - padding,
                minY: shape.y - padding,
                maxX: shape.x + textWidth + padding,
                maxY: shape.y + textHeight + padding
            };
        }
        
        return null;
    }

    // Method to get resize handle at a point
    private getResizeHandle(x: number, y: number): string {
        if (!this.clickedShape) return '';
        
        const bounds = this.getSelectionBoxBounds();
        if (!bounds) return '';
        
        const handleSize = 6; // Smaller handles like Excalidraw
        const handleOffset = 2; // Slight offset from selection box
        
        // Check corners only (4 handles)
        if (x >= bounds.maxX - handleSize - handleOffset && x <= bounds.maxX + handleOffset && 
            y >= bounds.maxY - handleSize - handleOffset && y <= bounds.maxY + handleOffset) return 'se';
        if (x >= bounds.minX - handleOffset && x <= bounds.minX + handleSize + handleOffset && 
            y >= bounds.maxY - handleSize - handleOffset && y <= bounds.maxY + handleOffset) return 'sw';
        if (x >= bounds.maxX - handleSize - handleOffset && x <= bounds.maxX + handleOffset && 
            y >= bounds.minY - handleOffset && y <= bounds.minY + handleSize + handleOffset) return 'ne';
        if (x >= bounds.minX - handleOffset && x <= bounds.minX + handleSize + handleOffset && 
            y >= bounds.minY - handleOffset && y <= bounds.minY + handleSize + handleOffset) return 'nw';
        
        return '';
    }

    // Method to update cursor based on selected tool
    private updateCursor() {
        if (!this.canvas) return;
        
        // If resizing, show resize cursor
        if (this.isResizing) {
            this.canvas.style.cursor = "nw-resize";
            return;
        }
        
        // If dragging, show grabbing cursor
        if (this.isDragging && this.selectedTool === 'mouse') {
            this.canvas.style.cursor = "grabbing";
            return;
        }
        
        // Check for resize handles if mouse tool is selected and shape is selected
        if (this.selectedTool === 'mouse' && this.clickedShape) {
            const handle = this.getResizeHandle(this.currentMouseX, this.currentMouseY);
            if (handle) {
                switch (handle) {
                    case 'nw':
                    case 'se':
                        this.canvas.style.cursor = "nw-resize";
                        break;
                    case 'ne':
                    case 'sw':
                        this.canvas.style.cursor = "ne-resize";
                        break;
                    case 'n':
                    case 's':
                        this.canvas.style.cursor = "ns-resize";
                        break;
                    case 'e':
                    case 'w':
                        this.canvas.style.cursor = "ew-resize";
                        break;
                }
                return;
            }
        }
        
        switch (this.selectedTool) {
            case "rect":
            case "circle":
            case "diamond":
            case "line":
            case "arrow":
            case "pencil":
                this.canvas.style.cursor = "crosshair";
                break;
            case "eraser":
                this.canvas.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><circle cx=\"10\" cy=\"10\" r=\"8\" fill=\"none\" stroke=\"white\" stroke-width=\"2\"/><circle cx=\"10\" cy=\"10\" r=\"6\" fill=\"none\" stroke=\"black\" stroke-width=\"1\"/></svg>') 10 10, auto";
                break;
            case "mouse":
                this.canvas.style.cursor = "default";
                break;
            case "hand":
                this.canvas.style.cursor = "grab";
                break;
            case "text":
                this.canvas.style.cursor = "text";
                break;
            default:
                this.canvas.style.cursor = "default";
                break;
        }
    }

    public sendText(){
        this.socket.send(JSON.stringify({
            type:"text",
            text:this.text.text,
            x:this.text.x,
            y:this.text.y,
            fontSize:this.fontSize,
            fontFamily:this.currentFont,
            roomId:this.roomId,
            sentBy :  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'
        }))

        this.renderCanvas();
        this.setSelectedTool('mouse')
    }
    
    public clearCanvas(){
        this.existingShapes = [];
        this.renderCanvas();
        this.clickedShape = undefined;
        this.clickedShapeIndex = -1;
        this.prevShape = undefined;
        this.socket.send(JSON.stringify({
            type:"clear_canvas",
            roomId:this.roomId,
            sentBy :  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'
        }))
    }
    // Method to clear shape selection
    clearSelection() {
        this.clickedShape = undefined;
        this.clickedShapeIndex = -1;
        this.renderCanvas();
    }
    isPointInsideShape(x: number, y: number, shape: Shape): boolean {

        if (shape.type === "rect") {
            // Handle negative width/height by computing actual bounds
            const actualX = shape.width < 0 ? shape.x + shape.width : shape.x;
            const actualY = shape.height < 0 ? shape.y + shape.height : shape.y;
            const actualWidth = Math.abs(shape.width);
            const actualHeight = Math.abs(shape.height);
            return x >= actualX && x <= actualX + actualWidth &&
                   y >= actualY && y <= actualY + actualHeight;
        } 
        else if (shape.type === "circle") {
            // Treat as ellipse. Fallback to circle if radius provided.
            const rx = shape.radiusX ?? shape.radius ?? 0;
            const ry = shape.radiusY ?? shape.radius ?? 0;
            if (rx === 0 && ry === 0) return false;
            const dx = (x - shape.centerX) / rx;
            const dy = (y - shape.centerY) / ry;
            return (dx * dx + dy * dy) <= 1;
        } 
        else if (shape.type === "diamond") {
            return isPointInsidePolygon(x, y, [
                { x: shape.x1, y: shape.y1 },  // Top
                { x: shape.x2, y: shape.y2 },  // Right
                { x: shape.x3, y: shape.y3 },  // Bottom
                { x: shape.x4, y: shape.y4 }   // Left
            ]);
        } 
        else if (shape.type === "line" || shape.type === "arrow") {
            return isPointNearLine(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
        } 
        else if (shape.type === "pencil") {
            return isPointNearPencilPath(x, y, shape.points);
        }
        else if (shape.type === "text") {
            // For text, check if point is within the text bounds
   
            this.ctx.font = `${shape.fontSize}px ${shape.fontFamily}, sans-serif`;
            const textMetrics = this.ctx.measureText(shape.text);
            const textWidth = textMetrics.width;
            const textHeight = shape.fontSize;
            return x >= shape.x && x <= shape.x + textWidth &&
                   y >= shape.y && y <= shape.y + textHeight;
        }
        return false;
    }
    
    async init() {
        this.existingShapes = await getExisitingShapes(this.roomId);
        console.log("shapes",this.existingShapes);

        this.renderCanvas();
    }

       deleteShape(){
    
        if (this.clickedShapeIndex === undefined) {
            console.error("Error: clickedShapeIndex is undefined.");
            return;
        }
        this.existingShapes = this.existingShapes.filter(({ id }) => id !== this.clickedShapeIndex);
    
        this.socket.send(JSON.stringify(
            {
                type:"delete_shape",
                shape:this.clickedShapeIndex,
                roomId:this.roomId,
                sentBy :  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'
            }
        )

        )


     }
    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                console.log(message)
                const id = JSON.parse(message.id)
                const parsedShape = JSON.parse(message.message)
                console.log("parsedSHape",parsedShape)
                const newShape = {shape:parsedShape.shape,id}
                this.existingShapes.push(newShape)
                
                // Auto-select the newly created shape if it was created by the current user
                if (message.sentBy === this.session?.accessToken) {
                    this.clickedShape = newShape;
                    this.clickedShapeIndex = id;
                    this.prevShape = JSON.parse(JSON.stringify(newShape));
                }
                
                this.renderCanvas();
            }

            else if(message.type=='delete_shape'){
                console.log("delete shape ", message);
                const id = JSON.parse(message.id)

                this.clickedShapeIndex = id
                this.deleteShape()
            }
            // else if(message.type === 'local_delete_shape' ){
            //     this.clickedShapeIndex = JSON.parse(message.id)
            //     this.existingShapes = this.existingShapes.filter(({ id }) => id !== this.clickedShapeIndex);
            //     this.renderCanvas()
            // }
            else if(message.type === 'update_shape'){
                const token = message.sentBy
                console.log("update shape msg rcvd ", message)

                // if(token === this.session.accessToken)
                // {
                //     console.log("You sent it !!!")
                //     return;
                // }


                let shapeIndex = this.existingShapes.findIndex(shape => shape.id === message.shape.id);

                if (shapeIndex !== -1) {
                    // Update existing shape
                    this.existingShapes[shapeIndex].shape = message.shape.shape;
                } else {
                    // Add new shape if not found
                    this.existingShapes.push({ id: message.shape.id, shape: message.shape.shape });
                }

                this.renderCanvas()
            }
            else if(message.type === 'update_shape_color'){
                console.log("update_shape_color received 69", message);
                let shapeIndex = this.existingShapes.findIndex(shape => shape.id === message.id);
                if (shapeIndex !== -1) {
                    this.existingShapes[shapeIndex].color = message.color;
                    this.renderCanvas();
                }
            }
            else if(message.type === 'update_shape_stroke_width'){
                console.log("update_shape_stroke_width received 69", message);
                let shapeIndex = this.existingShapes.findIndex(shape => shape.id === message.id);
                if (shapeIndex !== -1) {
                    let shape = this.existingShapes[shapeIndex].shape

                    this.existingShapes[shapeIndex].strokeWidth =message.shape?.strokeWidth;
                    this.renderCanvas();
                }
            }
            else if(message.type === 'text'){
                console.log("text message received", message);
                const id = message.id; 
                const textShape: Shape = {
                    type: 'text',
                    x: message.x,
                    y: message.y,
                    text: message.text,
                    fontSize:message.fontSize,
                    fontFamily:message.fontFamily
                };
                const newTextShape = {shape: textShape, id};
                this.existingShapes.push(newTextShape);
                
                // Auto-select the newly created text if it was created by the current user
                if (message.sentBy === this.session?.accessToken) {
                    this.clickedShape = newTextShape;
                    this.clickedShapeIndex = id;
                    this.prevShape = JSON.parse(JSON.stringify(newTextShape));
                }
                
                this.renderCanvas();
            }
            else if(message.type === 'update_shape_text'){
                console.log("update_shape_text received", message);
                const id = message.id;
                
                // Find the existing shape and update it instead of creating a new one
                let shapeIndex = this.existingShapes.findIndex(shape => shape.id === id);
                
                if (shapeIndex !== -1) {
                    // Update existing shape
                    const textShape: Shape = {
                        type: 'text',
                        x: message.shape.shape.x,
                        y: message.shape.shape.y,
                        text: message.shape.shape.text,
                        fontSize: message.shape.shape.fontSize,
                        fontFamily: message.shape.shape.fontFamily
                    };
                    this.existingShapes[shapeIndex].shape = textShape;
                } 
                this.renderCanvas();
        }
        else if(message.type === 'clear_canvas'){
            this.existingShapes = [];
            this.clickedShape = undefined;
            this.clickedShapeIndex = -1;
            this.prevShape = undefined;
            this.renderCanvas();
        }
        }
    }

    public renderCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.isDarkTheme ? "rgba(18,18,18,255)" : "rgba(255, 255, 255, 1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Notify parent component that canvas has been updated
        if (this.onCanvasUpdate) {
            this.onCanvasUpdate();
        }

        // Apply transformations
        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);
        this.ctx.scale(this.zoom / 100, this.zoom / 100);

        // Rendering existing shapes
        this.existingShapes.forEach(({ shape, id ,color,strokeWidth}) => {
            
            this.ctx.strokeStyle = color ? color : (this.isDarkTheme ? "#ffffff" : "#000000"); // Theme-appropriate default color
            this.ctx.lineWidth = strokeWidth ? strokeWidth : 2; // Reset line width
            this.ctx.fillStyle = color ? color : (this.isDarkTheme ? "#ffffff" : "#000000"); // For text fill
            
            if (shape?.type === "rect") {
                this.drawRoundedRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                const rx = Math.abs(shape.radiusX ?? shape.radius ?? 0);
                const ry = Math.abs(shape.radiusY ?? shape.radius ?? 0);
                if (rx > 0 && ry > 0) {
                    this.ctx.beginPath();
                    this.ctx.ellipse(shape.centerX, shape.centerY, rx, ry, 0, 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            } else if (shape?.type === "diamond") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.lineTo(shape.x3, shape.y3);
                this.ctx.lineTo(shape.x4, shape.y4);
                this.ctx.closePath();
                this.ctx.stroke();
            } else if (shape?.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.stroke();
            } else if (shape?.type === "arrow") {
                const headlen = 14;
                const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                const arrowX1 = shape.x2 - headlen * Math.cos(angle - Math.PI / 6);
                const arrowY1 = shape.y2 - headlen * Math.sin(angle - Math.PI / 6);
                const arrowX2 = shape.x2 - headlen * Math.cos(angle + Math.PI / 6);
                const arrowY2 = shape.y2 - headlen * Math.sin(angle + Math.PI / 6);
                this.ctx.moveTo(shape.x2, shape.y2);
                this.ctx.lineTo(arrowX1, arrowY1);
                this.ctx.moveTo(shape.x2, shape.y2);
                this.ctx.lineTo(arrowX2, arrowY2);
                this.ctx.stroke();
            }
            else if (shape?.type === "pencil") {
                console.log("rendering pencil", shape);
            
                for (let i = 0; i < shape.points.length - 1; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.points[i].x, shape.points[i].y);
                    this.ctx.lineTo(shape.points[i + 1].x, shape.points[i + 1].y);
                    this.ctx.lineWidth = strokeWidth ? strokeWidth : 2;
                    this.ctx.stroke();
                }
            }
            else if (shape?.type === "text") {
                // this.ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
                this.ctx.font = `${shape.fontSize}px ${shape.fontFamily}, sans-serif`
                // Adjust Y position to account for text baseline
                this.ctx.textBaseline = 'top'
                this.ctx.fillText(shape.text,shape.x,shape.y)   
            }
            
            
            if (this.clickedShape && this.clickedShape.shape === shape ) {
                // This will be handled by drawSelectionBox() method
            }
        });
        
        // Draw selection box and handles after all shapes are rendered
        this.drawSelectionBox();
        
        // Restore transformations
        this.ctx.restore();
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        const transformedCoords = this.screenToCanvas(e.clientX, e.clientY);
        this.startX = transformedCoords.x;
        this.startY = transformedCoords.y;
        this.isDragging = false;
        console.log(this.selectedTool,'tool')

        // Clear selection if not using mouse tool
        if (this.selectedTool !== "mouse") {
            this.clearSelection();
        }

        if (this.selectedTool === "mouse") {
            // Check for resize handles first
            if (this.clickedShape) {
                const handle = this.getResizeHandle(transformedCoords.x, transformedCoords.y);
                if (handle) {
                    this.isResizing = true;
                    this.resizeHandle = handle;
                    
                    const shape = this.clickedShape.shape;
                    if (shape.type === "rect") {
                        this.resizeStartData = {
                            width: shape.width,
                            height: shape.height,
                            x: shape.x,
                            y: shape.y
                        };
                    } else if (shape.type === "circle") {
                        const rx = Math.abs(shape.radiusX ?? shape.radius ?? 0);
                        const ry = Math.abs(shape.radiusY ?? shape.radius ?? 0);
                        this.resizeStartData = {
                            width: rx * 2,
                            height: ry * 2,
                            x: shape.centerX - rx,
                            y: shape.centerY - ry
                        };
                    } else if (shape.type === "diamond") {
                        const minX = Math.min(shape.x1, shape.x2, shape.x3, shape.x4);
                        const minY = Math.min(shape.y1, shape.y2, shape.y3, shape.y4);
                        const maxX = Math.max(shape.x1, shape.x2, shape.x3, shape.x4);
                        const maxY = Math.max(shape.y1, shape.y2, shape.y3, shape.y4);
                        this.resizeStartData = {
                            width: maxX - minX,
                            height: maxY - minY,
                            x: minX,
                            y: minY
                        };
                    } else if (shape.type === "line" || shape.type === "arrow") {
                        this.resizeStartData = {
                            width: shape.x2 - shape.x1,
                            height: shape.y2 - shape.y1,
                            x: shape.x1,
                            y: shape.y1
                        };
                    } else if (shape.type === "text") {
                        this.resizeStartData = {
                            width: shape.fontSize, // Store fontSize in width
                            height: shape.fontSize,
                            x: shape.x,
                            y: shape.y
                        };
                    }
                    return;
                }
            }
            
            let shapeVal: shapeArrayType | undefined = this.existingShapes.find(({ shape }) =>
                this.isPointInsideShape(transformedCoords.x, transformedCoords.y, shape)
            );
    
            
            if (shapeVal) {
                this.clickedShape = shapeVal;
                console.log("clicked shape 818818",this.clickedShape)
                this.clickedShapeIndex = shapeVal.id;
                this.prevShape = JSON.parse(JSON.stringify(shapeVal));
                this.isDragging = true;
    
                switch (shapeVal.shape.type) {
                    case "rect":
                        this.dragOffset = {
                            x: transformedCoords.x - shapeVal.shape.x,
                            y: transformedCoords.y - shapeVal.shape.y
                        };
                        break;

                    case "diamond":
                        // Calculate center of diamond for drag offset
                        const centerX = (shapeVal.shape.x1 + shapeVal.shape.x2 + shapeVal.shape.x3 + shapeVal.shape.x4) / 4;
                        const centerY = (shapeVal.shape.y1 + shapeVal.shape.y2 + shapeVal.shape.y3 + shapeVal.shape.y4) / 4;

                        this.dragOffset = {
                            x: transformedCoords.x - centerX,
                            y: transformedCoords.y - centerY
                        };
                        break;

                    case "circle":
                        this.dragOffset = {
                            x: transformedCoords.x - shapeVal.shape.centerX,
                            y: transformedCoords.y - shapeVal.shape.centerY
                        };
                        break;

                    case "line":
                    case "arrow":
                        this.dragOffset = {
                            x: transformedCoords.x - shapeVal.shape.x1,
                            y: transformedCoords.y - shapeVal.shape.y1
                        };
                        break;

                    case "pencil":
                        if (shapeVal.shape.type === "pencil") {
                            const pencilShape = shapeVal.shape;
                            if (pencilShape.points.length > 0) {
                                this.dragOffset = {
                                    x: transformedCoords.x - pencilShape.points[0].x,
                                    y: transformedCoords.y - pencilShape.points[0].y
                                };
                            }
                        }
                        break;
                    case "text":
                        this.dragOffset = {
                            x: transformedCoords.x - shapeVal.shape.x,
                            y: transformedCoords.y - shapeVal.shape.y
                        };
                        break;
                }

                console.log("text",this.text)
                this.renderCanvas(); 
                this.updateCursor(); // Update cursor when dragging starts

            }
            else{
                this.clickedShape = undefined;
                this.clickedShapeIndex = -1;
                this.renderCanvas();
            }

        }
    };
    
    mouseUpHandler = (e:MouseEvent) => {
        this.clicked = false
        const transformedCoords = this.screenToCanvas(e.clientX, e.clientY);
        const width = transformedCoords.x - this.startX;
        const height = transformedCoords.y - this.startY;
        this.isDragging = false
        
        // Handle resize completion
        if (this.isResizing && this.clickedShape) {
            this.isResizing = false;
            this.resizeHandle = '';
            
            // Send update to server
            this.socket.send(JSON.stringify({
                type: "update_shape",
                message: JSON.stringify({
                   shape: this.clickedShape
              }),
              roomId: this.roomId,
              sentBy: this.session?.accessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'
           }));
            return;
        }
        
        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        console.log("clicled",JSON.stringify(this.clickedShape),"clicked",JSON.stringify(this.prevShape))

        let isShapeChanged = JSON.stringify(this.clickedShape) === JSON.stringify(this.prevShape)
        if(this.selectedTool === 'mouse' && this.clickedShape && !this.isDragging && !isShapeChanged ){
                console.log("shape changed ", this.clickedShape)

                this.socket.send(JSON.stringify({
                    type: "update_shape",
                    message: JSON.stringify({
                       shape:this.clickedShape
                  }),
                  roomId: this.roomId,
                  sentBy : this.session?.accessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0Y2Q4ZWM3LTM1NWUtNGZlYy04YzNiLWIwYzUyYmU1MTFlMCIsImlhdCI6MTc1MzgwNjQ1NH0.bER-qZ5Lvk39mxILYj8O09aIjFeA5x8A1mST4dLyu7I'
               }))
        }
        
        this.updateCursor(); // Update cursor when mouse is released


        if (selectedTool === "rect") {

            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            // Create ellipse like Excalidraw
            const endX = this.startX + width;
            const endY = this.startY + height;
            const centerX = (this.startX + endX) / 2;
            const centerY = (this.startY + endY) / 2;
            const rx = Math.abs(endX - this.startX) / 2;
            const ry = Math.abs(endY - this.startY) / 2;
            shape = {
                type: "circle",
                centerX,
                centerY,
                radiusX: rx,
                radiusY: ry
            }

        }
        else if(selectedTool === 'pencil'){
            shape = {
                type:"pencil",
                points:this.pencilPath
            }
            console.log("pencil inserting",shape)
            this.pencilPath=[]
        }

        else if(selectedTool === 'diamond'){
            shape = {
                type:'diamond',
                x1:this.diamondCoords.P1.x,
                y1:this.diamondCoords.P1.y,
                x2:this.diamondCoords.P2.x,
                y2:this.diamondCoords.P2.y,
                x3:this.diamondCoords.P3.x,
                y3:this.diamondCoords.P3.y,
                x4:this.diamondCoords.P4.x,
                y4:this.diamondCoords.P4.y
            }
            this.diamondCoords =  {P1:{x:0,y:0},P2:{x:0,y:0},P3:{x:0,y:0},P4:{x:0,y:0}};
        }

        else if(selectedTool === 'line'){
            shape = {
                type :'line',
                x1:this.lineCoords.P1.x,
                y1:this.lineCoords.P1.y,
                x2:this.lineCoords.P2.x,
                y2:this.lineCoords.P2.y,

            }

            this.lineCoords = {P1:{x:0,y:0},P2:{x:0,y:0}}
        }
        else if(selectedTool === 'arrow'){
            shape = {
                type:'arrow',
                x1:this.arrowCoords.P1.x,
                y1:this.arrowCoords.P1.y,
                x2:this.arrowCoords.P2.x,
                y2:this.arrowCoords.P2.y,
            }
        }
        else if(selectedTool === 'text'){
            this.text.x = transformedCoords.x;
            this.text.y = transformedCoords.y;
            // Don't return here - let the text input handle the actual text creation
            return;
        }
        if (!shape) {
            return;
        }
        console.log(shape)

          this.socket.send(JSON.stringify({
              type: "chat",
              message: JSON.stringify({
                 shape
            }),
            roomId: this.roomId
         }))
         

         this.setSelectedTool('mouse')


    }
    mouseMoveHandler = (e:MouseEvent) => {
        if (this.clicked) {
            const transformedCoords = this.screenToCanvas(e.clientX, e.clientY);
            this.currentMouseX = transformedCoords.x;
            this.currentMouseY = transformedCoords.y;
            
            const width = transformedCoords.x - this.startX;
            const height = transformedCoords.y - this.startY;

            this.renderCanvas();
            this.drawPreview();
            // Handle pencil path updates
            if(this.selectedTool === 'pencil'){
                const currentX = transformedCoords.x;
                const currentY = transformedCoords.y;
                this.pencilPath.push({ x: currentX, y: currentY });
            }
            
            // Handle diamond coordinates
            if(this.selectedTool === 'diamond'){
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                this.diamondCoords.P1 = {x:centerX,y:this.startY} // Top
                this.diamondCoords.P2 = {x:this.startX + width,y:centerY} // Right
                this.diamondCoords.P3 = {x:centerX,y:this.startY + height} // Bottom
                this.diamondCoords.P4 = {x:this.startX,y:centerY} // Left
            }
            
            // Handle line coordinates
            if(this.selectedTool === 'line'){
                this.lineCoords.P1= {x:this.startX,y:this.startY}
                this.lineCoords.P2= {x:transformedCoords.x,y:transformedCoords.y}
            }
            
            // Handle arrow coordinates
            if(this.selectedTool === 'arrow'){
                this.arrowCoords.P1= {x:this.startX,y:this.startY}
                this.arrowCoords.P2= {x:transformedCoords.x,y:transformedCoords.y}
            }
            else if(this.selectedTool === 'eraser'){
                let shapeVal: shapeArrayType | undefined = this.existingShapes.find(({ shape }) =>
                    this.isPointInsideShape(transformedCoords.x, transformedCoords.y, shape)
                );
  
                    
                    if (shapeVal) {
      

                        console.log(shapeVal.id , "del")
                        this.clickedShapeIndex = shapeVal.id
                        console.log(this.clickedShapeIndex, 'pleasw')
                        this.deleteShape();

                    }


                    else{
                        console.log("no shape to del")
                    }
                
        
            }
            else if(this.selectedTool === 'text'){
                return;
            }
        }


        // Handle resizing
        if (this.isResizing && this.clickedShape && this.clicked && this.selectedTool === 'mouse') {
            const transformedCoords = this.screenToCanvas(e.clientX, e.clientY);
            const deltaX = transformedCoords.x - this.startX;
            const deltaY = transformedCoords.y - this.startY;
            
            const shape = this.clickedShape.shape;
            const minSize = 10;
            
            if (shape.type === "rect") {
                const rect = shape;
                const startWidth = this.resizeStartData.width;
                const startHeight = this.resizeStartData.height;
                const startX = this.resizeStartData.x;
                const startY = this.resizeStartData.y;
                
                // Check if Shift is held for aspect ratio
                const maintainAspectRatio = e.shiftKey;
                const aspectRatio = startWidth / startHeight;
                
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newX = startX;
                let newY = startY;
                
                switch (this.resizeHandle) {
                    case 'se': // bottom-right - only right and bottom edges move
                        newWidth = startWidth + deltaX;
                        newHeight = startHeight + deltaY;
                        if (maintainAspectRatio) {
                            newHeight = newWidth / aspectRatio;
                        }
                        break;
                    case 'sw': // bottom-left - left and bottom edges move
                        newX = startX + deltaX;
                        newWidth = startWidth - deltaX;
                        newHeight = startHeight + deltaY;
                        if (maintainAspectRatio) {
                            newHeight = newWidth / aspectRatio;
                        }
                        break;
                    case 'ne': // top-right - right and top edges move
                        newY = startY + deltaY;
                        newWidth = startWidth + deltaX;
                        newHeight = startHeight - deltaY;
                        if (maintainAspectRatio) {
                            newHeight = newWidth / aspectRatio;
                        }
                        break;
                    case 'nw': // top-left - left and top edges move
                        newX = startX + deltaX;
                        newY = startY + deltaY;
                        newWidth = startWidth - deltaX;
                        newHeight = startHeight - deltaY;
                        if (maintainAspectRatio) {
                            newHeight = newWidth / aspectRatio;
                        }
                        break;
                }
                
                // Apply minimum size constraints
                if (Math.abs(newWidth) >= minSize && Math.abs(newHeight) >= minSize) {
                    rect.x = newX;
                    rect.y = newY;
                    rect.width = newWidth;
                    rect.height = newHeight;
                }
            } else if (shape.type === "circle") {
                const circle = shape;
                const startRadiusX = this.resizeStartData.width / 2;
                const startRadiusY = this.resizeStartData.height / 2;
                const startCenterX = this.resizeStartData.x + startRadiusX;
                const startCenterY = this.resizeStartData.y + startRadiusY;
                
                const maintainAspectRatio = e.shiftKey;
                
                let newRadiusX = startRadiusX;
                let newRadiusY = startRadiusY;
                let newCenterX = startCenterX;
                let newCenterY = startCenterY;
                
                switch (this.resizeHandle) {
                    case 'se': // bottom-right - keep top-left corner fixed
                        newRadiusX = startRadiusX + deltaX / 2;
                        newRadiusY = startRadiusY + deltaY / 2;
                        // Center moves to keep top-left corner fixed
                        newCenterX = startCenterX + deltaX / 2;
                        newCenterY = startCenterY + deltaY / 2;
                        if (maintainAspectRatio) {
                            const maxRadius = Math.max(newRadiusX, newRadiusY);
                            newRadiusX = maxRadius;
                            newRadiusY = maxRadius;
                        }
                        break;
                    case 'sw': // bottom-left - keep top-right corner fixed
                        newCenterX = startCenterX + deltaX / 2;
                        newRadiusX = startRadiusX - deltaX / 2;
                        newRadiusY = startRadiusY + deltaY / 2;
                        if (maintainAspectRatio) {
                            const maxRadius = Math.max(Math.abs(newRadiusX), Math.abs(newRadiusY));
                            newRadiusX = maxRadius;
                            newRadiusY = maxRadius;
                        }
                        break;
                    case 'ne': // top-right - keep bottom-left corner fixed
                        newRadiusX = startRadiusX + deltaX / 2;
                        newRadiusY = startRadiusY - deltaY / 2;
                        // Center moves to keep bottom-left corner fixed
                        newCenterX = startCenterX + deltaX / 2;
                        newCenterY = startCenterY + deltaY / 2;
                        if (maintainAspectRatio) {
                            const maxRadius = Math.max(Math.abs(newRadiusX), Math.abs(newRadiusY));
                            newRadiusX = maxRadius;
                            newRadiusY = maxRadius;
                        }
                        break;
                    case 'nw': // top-left - keep bottom-right corner fixed
                        newCenterX = startCenterX + deltaX / 2;
                        newCenterY = startCenterY + deltaY / 2;
                        newRadiusX = startRadiusX - deltaX / 2;
                        newRadiusY = startRadiusY - deltaY / 2;
                        if (maintainAspectRatio) {
                            const maxRadius = Math.max(Math.abs(newRadiusX), Math.abs(newRadiusY));
                            newRadiusX = maxRadius;
                            newRadiusY = maxRadius;
                        }
                        break;
                }
                
                if (Math.abs(newRadiusX) >= minSize / 2 && Math.abs(newRadiusY) >= minSize / 2) {
                    circle.centerX = newCenterX;
                    circle.centerY = newCenterY;
                    circle.radiusX = Math.abs(newRadiusX);
                    circle.radiusY = Math.abs(newRadiusY);
                }
            } else if (shape.type === "diamond") {
                const diamond = shape;
                const startWidth = this.resizeStartData.width;
                const startHeight = this.resizeStartData.height;
                const startCenterX = this.resizeStartData.x + startWidth / 2;
                const startCenterY = this.resizeStartData.y + startHeight / 2;
                
                const maintainAspectRatio = e.shiftKey;
                const aspectRatio = startWidth / startHeight;
                
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newCenterX = startCenterX;
                let newCenterY = startCenterY;
                
                switch (this.resizeHandle) {
                    case 'se': // bottom-right - keep top-left corner fixed
                        newCenterX = startCenterX + deltaX / 2;
                        newCenterY = startCenterY + deltaY / 2;
                        newWidth = startWidth + deltaX;
                        newHeight = startHeight + deltaY;
                        if (maintainAspectRatio) {
                            newHeight = newWidth / aspectRatio;
                        }
                        break;
                    case 'sw': // bottom-left - keep top-right corner fixed
                        newCenterX = startCenterX + deltaX / 2;
                        newCenterY = startCenterY + deltaY / 2;
                        newWidth = startWidth - deltaX;
                        newHeight = startHeight + deltaY;
                        if (maintainAspectRatio) {
                            newHeight = newWidth / aspectRatio;
                        }
                        break;
                    case 'ne': // top-right - keep bottom-left corner fixed
                        newCenterX = startCenterX + deltaX / 2;
                        newCenterY = startCenterY + deltaY / 2;
                        newWidth = startWidth + deltaX;
                        newHeight = startHeight - deltaY;
                        if (maintainAspectRatio) {
                            newHeight = newWidth / aspectRatio;
                        }
                        break;
                    case 'nw': // top-left - keep bottom-right corner fixed
                        newCenterX = startCenterX + deltaX / 2;
                        newCenterY = startCenterY + deltaY / 2;
                        newWidth = startWidth - deltaX;
                        newHeight = startHeight - deltaY;
                        if (maintainAspectRatio) {
                            newHeight = newWidth / aspectRatio;
                        }
                        break;
                }
                
                if (Math.abs(newWidth) >= minSize && Math.abs(newHeight) >= minSize) {
                    const halfWidth = newWidth / 2;
                    const halfHeight = newHeight / 2;
                    
                    diamond.x1 = newCenterX; // top
                    diamond.y1 = newCenterY - halfHeight;
                    diamond.x2 = newCenterX + halfWidth; // right
                    diamond.y2 = newCenterY;
                    diamond.x3 = newCenterX; // bottom
                    diamond.y3 = newCenterY + halfHeight;
                    diamond.x4 = newCenterX - halfWidth; // left
                    diamond.y4 = newCenterY;
                }
            } else if (shape.type === "line" || shape.type === "arrow") {
                const line = shape;
                const startX1 = this.resizeStartData.x;
                const startY1 = this.resizeStartData.y;
                const startX2 = startX1 + this.resizeStartData.width;
                const startY2 = startY1 + this.resizeStartData.height;
                
                switch (this.resizeHandle) {
                    case 'se': // end point
                        line.x2 = startX2 + deltaX;
                        line.y2 = startY2 + deltaY;
                        break;
                    case 'nw': // start point
                        line.x1 = startX1 + deltaX;
                        line.y1 = startY1 + deltaY;
                        break;
                    case 'ne': // end point (x), start point (y)
                        line.x2 = startX2 + deltaX;
                        line.y1 = startY1 + deltaY;
                        break;
                    case 'sw': // start point (x), end point (y)
                        line.x1 = startX1 + deltaX;
                        line.y2 = startY2 + deltaY;
                        break;
                }
            } else if (shape.type === "text") {
                const text = shape;
                const startFontSize = this.resizeStartData.width; // Using width to store fontSize
                const startX = this.resizeStartData.x;
                const startY = this.resizeStartData.y;
                
                // For text, use the larger of deltaX or deltaY, but respect the direction
                const sizeChange = Math.max(Math.abs(deltaX), Math.abs(deltaY));
                const direction = (deltaX > 0 || deltaY > 0) ? 1 : -1;
                
                switch (this.resizeHandle) {
                    case 'se': // bottom-right - increase/decrease font size, keep left edge fixed
                        const newFontSizeSE = Math.max(8, startFontSize + (sizeChange * direction));
                        text.fontSize = newFontSizeSE;
                        break;
                    case 'sw': // bottom-left - increase/decrease font size, keep right edge fixed
                        const newFontSizeSW = Math.max(8, startFontSize + (sizeChange * direction));
                        text.fontSize = newFontSizeSW;
                        break;
                    case 'ne': // top-right - increase/decrease font size, keep left edge fixed
                        const newFontSizeNE = Math.max(8, startFontSize + (sizeChange * direction));
                        text.fontSize = newFontSizeNE;
                        break;
                    case 'nw': // top-left - increase/decrease font size, keep right edge fixed
                        const newFontSizeNW = Math.max(8, startFontSize + (sizeChange * direction));
                        text.fontSize = newFontSizeNW;
                        break;
                }
            }
            
            this.renderCanvas();
            return;
        }
        
        if (this.isDragging && this.clickedShape && this.clicked && this.selectedTool === 'mouse') {
            const transformedCoords = this.screenToCanvas(e.clientX, e.clientY);
            switch (this.clickedShape.shape.type) {
                case "rect":
                    this.clickedShape.shape.x = transformedCoords.x - this.dragOffset.x;
                    this.clickedShape.shape.y = transformedCoords.y - this.dragOffset.y;
                    break;
        
                case "diamond":
                    // Calculate new center position
                    const newCenterX = transformedCoords.x - this.dragOffset.x;
                    const newCenterY = transformedCoords.y - this.dragOffset.y;
                    
                    // Calculate current center
                    const currentCenterX = (this.clickedShape.shape.x1 + this.clickedShape.shape.x2 + this.clickedShape.shape.x3 + this.clickedShape.shape.x4) / 4;
                    const currentCenterY = (this.clickedShape.shape.y1 + this.clickedShape.shape.y2 + this.clickedShape.shape.y3 + this.clickedShape.shape.y4) / 4;
                    
                    // Calculate offset
                    const offsetX = newCenterX - currentCenterX;
                    const offsetY = newCenterY - currentCenterY;
                    
                    // Move all points by the offset
                    this.clickedShape.shape.x1 += offsetX;
                    this.clickedShape.shape.y1 += offsetY;
                    this.clickedShape.shape.x2 += offsetX;
                    this.clickedShape.shape.y2 += offsetY;
                    this.clickedShape.shape.x3 += offsetX;
                    this.clickedShape.shape.y3 += offsetY;
                    this.clickedShape.shape.x4 += offsetX;
                    this.clickedShape.shape.y4 += offsetY;
                    break;
        
                case "circle":
                    this.clickedShape.shape.centerX = transformedCoords.x - this.dragOffset.x;
                    this.clickedShape.shape.centerY = transformedCoords.y - this.dragOffset.y;
                    break;
        
                case "line":
                case "arrow":
                    let moveX = transformedCoords.x - this.dragOffset.x;
                    let moveY = transformedCoords.y - this.dragOffset.y;
                
                    let lineOffsetX = moveX - this.clickedShape.shape.x1;
                    let lineOffsetY = moveY - this.clickedShape.shape.y1;
                
                    this.clickedShape.shape.x1 += lineOffsetX;
                    this.clickedShape.shape.y1 += lineOffsetY;
                    this.clickedShape.shape.x2 += lineOffsetX;
                    this.clickedShape.shape.y2 += lineOffsetY;
                    break;
        
                case "pencil":
                    if (this.clickedShape.shape.type === "pencil") {
                        const pencilShape = this.clickedShape.shape;
                        if (pencilShape.points.length > 0) {
                            let moveDeltaX = transformedCoords.x - this.dragOffset.x;
                            let moveDeltaY = transformedCoords.y - this.dragOffset.y;
                            
                            pencilShape.points = pencilShape.points.map(point => ({
                                x: point.x + moveDeltaX - pencilShape.points[0].x,
                                y: point.y + moveDeltaY - pencilShape.points[0].y
                            }));
                        }
                    }
                    break;
                case "text":
                    this.clickedShape.shape.x = transformedCoords.x - this.dragOffset.x;
                    this.clickedShape.shape.y = transformedCoords.y - this.dragOffset.y;
                    break;
            }
            this.updateCursor(); // Update cursor during dragging
        }
        
    }

     resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            console.log("Canvas data" , this.canvas.width, this.canvas.height)

    };
    

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    

    }


}
