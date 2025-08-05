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
    strokeWidth?:number
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
    radius: number;
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

    private isDragging = false;
    private dragOffset = { x: 0, y: 0 };

    // Zoom and pan state
    private zoom: number = 100;
    private panOffset: Point = { x: 0, y: 0 };

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket,setSelectedTool :Dispatch<SetStateAction<Tool>>,session:Session) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        this.clearCanvas()
        this.setSelectedTool = setSelectedTool
        this.session = session
        this.updateCursor(); // Set initial cursor
    }

    // Method to update zoom and pan state
    updateTransform(zoom: number, panOffset: Point) {
        this.zoom = zoom;
        this.panOffset = panOffset;
    }

    // Method to set theme
    public setTheme(isDark: boolean) {
        this.isDarkTheme = isDark;
        this.clearCanvas();
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
        this.clearCanvas();
        this.socket.send(JSON.stringify({
            type:"update_shape_color",
            id:id,
            shape:shape,
            color:color,
            roomId:this.roomId,
            sentBy : this.session.accessToken
        }))
    }

    public updateShapeStrokeWidth(id:number,strokeWidth:number){
        let shape = this.existingShapes.find(shapeItem => shapeItem.id === id) ;
        if(shape){
            shape.strokeWidth = strokeWidth;
            console.log("shape",shape)
        }
        this.clearCanvas();
        this.socket.send(JSON.stringify({
            type:"update_shape_stroke_width",
            id:id,
            shape:shape,
            strokeWidth:strokeWidth,
            roomId:this.roomId,
            sentBy : this.session.accessToken
        }))
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
            const radius = Math.max(width, height) / 2;
            const centerX = this.startX + radius;
            const centerY = this.startY + radius;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
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
            const centerX = this.startX + width / 2;
            const centerY = this.startY + height / 2;

            this.ctx.beginPath();
            this.ctx.moveTo(centerX, this.startY); // Top point
            this.ctx.lineTo(this.startX, centerY); // Left point
            this.ctx.lineTo(centerX, this.startY + height); // Bottom point
            this.ctx.lineTo(this.startX + width, centerY); // Right point
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

    // Method to update cursor based on selected tool
    private updateCursor() {
        if (!this.canvas) return;
        
        // If dragging, show grabbing cursor
        if (this.isDragging && this.selectedTool === 'mouse') {
            this.canvas.style.cursor = "grabbing";
            return;
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

    // Method to clear shape selection
    clearSelection() {
        this.clickedShape = undefined;
        this.clickedShapeIndex = -1;
        this.clearCanvas();
    }
    isPointInsideShape(x: number, y: number, shape: Shape): boolean {

        if (shape.type === "rect") {
            return x >= shape.x && x <= shape.x + shape.width &&
                   y >= shape.y && y <= shape.y + shape.height;
        } 
        else if (shape.type === "circle") {
            const dx = x - shape.centerX;
            const dy = y - shape.centerY;
            return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
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
        return false;
    }
    
    async init() {
        this.existingShapes = await getExisitingShapes(this.roomId);
        console.log("shapes",this.existingShapes);

        this.clearCanvas();
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
                sentBy : this.session.accessToken
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
                this.existingShapes.push({shape:parsedShape.shape,id})
                this.clearCanvas();
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
            //     this.clearCanvas()
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

                this.clearCanvas()
            }
            else if(message.type === 'update_shape_color'){
                console.log("update_shape_color received 69", message);
                let shapeIndex = this.existingShapes.findIndex(shape => shape.id === message.id);
                if (shapeIndex !== -1) {
                    this.existingShapes[shapeIndex].color = message.color;
                    this.clearCanvas();
                }
            }
            else if(message.type === 'update_shape_stroke_width'){
                console.log("update_shape_stroke_width received 69", message);
                let shapeIndex = this.existingShapes.findIndex(shape => shape.id === message.id);
                if (shapeIndex !== -1) {
                    let shape = this.existingShapes[shapeIndex].shape

                    this.existingShapes[shapeIndex].strokeWidth =message.shape?.strokeWidth;
                    this.clearCanvas();
                }
            }
        }
    }

     clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.isDarkTheme ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply transformations
        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);
        this.ctx.scale(this.zoom / 100, this.zoom / 100);

        this.existingShapes.forEach(({ shape, id ,color,strokeWidth}) => {
    
            this.ctx.strokeStyle = color ? color : (this.isDarkTheme ? "#ffffff" : "#000000"); // Theme-appropriate default color
            this.ctx.lineWidth = strokeWidth ? strokeWidth : 2; // Reset line width
            
            console.log("shape",shape)
            if (shape.type === "rect") {
                this.drawRoundedRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "diamond") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.lineTo(shape.x3, shape.y3);
                this.ctx.lineTo(shape.x4, shape.y4);
                this.ctx.closePath();
                this.ctx.stroke();
            } else if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.stroke();
            } else if (shape.type === "arrow") {
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
            else if (shape.type === "pencil") {
                console.log("rendering pencil", shape);
            
                for (let i = 0; i < shape.points.length - 1; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.points[i].x, shape.points[i].y);
                    this.ctx.lineTo(shape.points[i + 1].x, shape.points[i + 1].y);
                    this.ctx.lineWidth = strokeWidth ? strokeWidth : 2;
                    this.ctx.stroke();
                }
            }
            
            
        
            if (this.clickedShape && this.clickedShape.shape === shape ) {
                this.ctx.strokeStyle = "#0096FF"; 
                this.ctx.lineWidth = 2;
        
                let minX: number, minY: number, maxX: number, maxY: number;
                if (shape.type === "rect") {
                    // Handle negative width/height by calculating actual bounds
                    const actualX = shape.width < 0 ? shape.x + shape.width : shape.x;
                    const actualY = shape.height < 0 ? shape.y + shape.height : shape.y;
                    const actualWidth = Math.abs(shape.width);
                    const actualHeight = Math.abs(shape.height);
                    
                    // Add consistent padding for all shapes
                    const padding = 5;
                    minX = actualX - padding;
                    minY = actualY - padding;
                    maxX = actualX + actualWidth + padding;
                    maxY = actualY + actualHeight + padding;
                } else if (shape.type === "circle") {
                    const padding = 5;
                    minX = shape.centerX - shape.radius - padding;
                    minY = shape.centerY - shape.radius - padding;
                    maxX = shape.centerX + shape.radius + padding;
                    maxY = shape.centerY + shape.radius + padding;
                } else if (shape.type === "diamond") {
                    const padding = 5;
                    minX = Math.min(shape.x1, shape.x2, shape.x3, shape.x4) - padding;
                    minY = Math.min(shape.y1, shape.y2, shape.y3, shape.y4) - padding;
                    maxX = Math.max(shape.x1, shape.x2, shape.x3, shape.x4) + padding;
                    maxY = Math.max(shape.y1, shape.y2, shape.y3, shape.y4) + padding;
                } else if (shape.type === "line" || shape.type === "arrow") {
                    const padding = 5;
                    minX = Math.min(shape.x1, shape.x2) - padding;
                    minY = Math.min(shape.y1, shape.y2) - padding;
                    maxX = Math.max(shape.x1, shape.x2) + padding;
                    maxY = Math.max(shape.y1, shape.y2) + padding;
                } else if (shape.type === "pencil") {
                    // For pencil shapes, calculate bounds from all points
                    const points = shape.points;
                    if (points.length > 0) {
                        const padding = 5;
                        minX = Math.min(...points.map(p => p.x)) - padding;
                        minY = Math.min(...points.map(p => p.y)) - padding;
                        maxX = Math.max(...points.map(p => p.x)) + padding;
                        maxY = Math.max(...points.map(p => p.y)) + padding;
                    } else {
                        return; // Skip if no points
                    }
                } else {
                    return; // Skip if shape type is not handled
                }
        
                // Draw selection box with consistent styling
                this.ctx.setLineDash([5, 5]); // Creates a dashed effect
                this.ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
                this.ctx.setLineDash([]); // Reset line dash to solid for other drawings
            }
        });
        
        // Restore transformations
        this.ctx.restore();
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        const transformedCoords = this.screenToCanvas(e.clientX, e.clientY);
        this.startX = transformedCoords.x;
        this.startY = transformedCoords.y;
        this.isDragging = false;

        // Clear selection if not using mouse tool
        if (this.selectedTool !== "mouse") {
            this.clearSelection();
        }

        if (this.selectedTool === "mouse") {
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
                        let centerX = (shapeVal.shape.x1 + shapeVal.shape.x3) / 2;
                        let centerY = (shapeVal.shape.y1 + shapeVal.shape.y3) / 2;

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
                }
                this.clearCanvas(); 
                this.updateCursor(); // Update cursor when dragging starts

            }
            else{
                this.clickedShape = undefined;
                this.clickedShapeIndex = -1;
                this.clearCanvas();
            }
        }
    };
    
    mouseUpHandler = (e:MouseEvent) => {
        this.clicked = false
        const transformedCoords = this.screenToCanvas(e.clientX, e.clientY);
        const width = transformedCoords.x - this.startX;
        const height = transformedCoords.y - this.startY;
        this.isDragging = false
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
                  sentBy : this.session.accessToken
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
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
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
        if (!shape) {
            return;
        }

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

            this.clearCanvas();
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
                this.diamondCoords.P1 = {x:centerX,y:this.startY}
                this.diamondCoords.P2 = {x:this.startX,y:centerY}
                this.diamondCoords.P3 = {x:centerX,y:this.startY+height}
                this.diamondCoords.P4 = {x:this.startX+width,y:centerY}
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
            
        }











        if (this.isDragging && this.clickedShape && this.clicked && this.selectedTool === 'mouse') {
            const transformedCoords = this.screenToCanvas(e.clientX, e.clientY);
            switch (this.clickedShape.shape.type) {
                case "rect":
                    this.clickedShape.shape.x = transformedCoords.x - this.dragOffset.x;
                    this.clickedShape.shape.y = transformedCoords.y - this.dragOffset.y;
                    break;
        
                case "diamond":
                    let dxDiamond = transformedCoords.x - this.dragOffset.x;
                    let dyDiamond = transformedCoords.y - this.dragOffset.y;
                
                    let offsetX = dxDiamond - this.clickedShape.shape.x1;
                    let offsetY = dyDiamond - this.clickedShape.shape.y1;
                
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
