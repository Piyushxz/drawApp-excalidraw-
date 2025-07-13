import { Tool } from "@/components/ShapeOptionBar";
import { getExisitingShapes } from "./util";
import { Dispatch, SetStateAction } from 'react'

import axios from "axios";
import { BACKEND_URL } from "@/config";
import { isPointInsidePolygon, isPointNearLine, isPointNearPencilPath } from "./deleteFunctionality";
import { Session } from "next-auth";

interface shapeArrayType{
    id:number,
    shape:Shape
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
    private pencilPath : Point[] = []
    public selectedTool: Tool = "circle";
    private diamondCoords: Diamond = {P1:{x:0,y:0},P2:{x:0,y:0},P3:{x:0,y:0},P4:{x:0,y:0}};
    private lineCoords : Line = {P1:{x:0,y:0},P2:{x:0,y:0}}
    private arrowCoords : Line = {P1:{x:0,y:0},P2:{x:0,y:0}}
    private clickedShapeIndex:number = -1;
    private clickedShape:shapeArrayType | undefined
    private prevShape:shapeArrayType | undefined
    private setSelectedTool : Dispatch<SetStateAction<Tool>>;
    private session:Session

    private isDragging = false;
    private dragOffset = { x: 0, y: 0 };

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
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
        if(this.selectedTool !== 'arrow'){
            this.clickedShape = undefined
        }
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
            else if(message.type === 'local_delete_shape' ){
                this.clickedShapeIndex = JSON.parse(message.id)
                this.existingShapes = this.existingShapes.filter(({ id }) => id !== this.clickedShapeIndex);
                this.clearCanvas()
            }else if(message.type === 'update_shape'){
                const token = message.sentBy
                console.log("update shape msg rcvd ", message)

                if(token === this.session.accessToken)
                {
                    console.log("You sent it !!!")
                    return;
                }


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
        }
    }

     clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach(({ shape, id }) => {
        
            this.ctx.strokeStyle = "rgba(255, 255, 255)"; // Default stroke color
            this.ctx.lineWidth = 1; // Reset line width
        
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
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
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
            
            
        
            if (this.clickedShape && this.clickedShape.shape === shape ) {
                this.ctx.strokeStyle = "#0096FF"; 
                this.ctx.lineWidth = 1;
        
                let minX, minY, maxX, maxY;
                if (shape.type === "rect") {
                    let paddingX = 5; 
                    let paddingY = 2; 
                
                    minX = shape.x - paddingX;
                    minY = shape.y - paddingY;
                    maxX = shape.x + shape.width + paddingX;
                    maxY = shape.y + shape.height + paddingY;
                } else if (shape.type === "circle") {
                    minX = shape.centerX - shape.radius;
                    minY = shape.centerY - shape.radius;
                    maxX = shape.centerX + shape.radius;
                    maxY = shape.centerY + shape.radius;
                } else if (shape.type === "diamond") {
                    minX = Math.min(shape.x1, shape.x2, shape.x3, shape.x4);
                    minY = Math.min(shape.y1, shape.y2, shape.y3, shape.y4);
                    maxX = Math.max(shape.x1, shape.x2, shape.x3, shape.x4);
                    maxY = Math.max(shape.y1, shape.y2, shape.y3, shape.y4);
                } else if (shape.type === "line" || shape.type === "arrow") {
                    minX = Math.min(shape.x1, shape.x2);
                    minY = Math.min(shape.y1, shape.y2);
                    maxX = Math.max(shape.x1, shape.x2);
                    maxY = Math.max(shape.y1, shape.y2);
                }
        
                let boxSize = Math.max(maxX - minX, maxY - minY);
                let centerX = (minX + maxX) / 2;
                let centerY = (minY + maxY) / 2;
                let squareX = centerX - boxSize / 2;
                let squareY = centerY - boxSize / 2;
                this.ctx.setLineDash([5, 5]); // Creates a dashed effect
                this.ctx.globalAlpha = 0.6; // Reduces opacity
                this.ctx.strokeRect(squareX - 5, squareY - 5, boxSize + 10, boxSize + 10);
                this.ctx.setLineDash([]); // Reset line dash to solid for other drawings
                this.ctx.globalAlpha = 1; // Reset opacity to normal
            }
        });
        
        
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.isDragging = false;
    
        if (this.selectedTool === "mouse") {
            let shapeVal: shapeArrayType | undefined = this.existingShapes.find(({ shape }) =>
                this.isPointInsideShape(e.clientX, e.clientY, shape)
            );
    
            console.log("shape from mouse", shapeVal);
    
            if (shapeVal) {
                this.clickedShape = shapeVal;
                this.prevShape = JSON.parse(JSON.stringify(shapeVal));
                this.isDragging = true;
    
                switch (shapeVal.shape.type) {
                    case "rect":
                        this.dragOffset = {
                            x: e.clientX - shapeVal.shape.x,
                            y: e.clientY - shapeVal.shape.y
                        };
                        break;
    
                    case "diamond":
                        let centerX = (shapeVal.shape.x1 + shapeVal.shape.x3) / 2;
                        let centerY = (shapeVal.shape.y1 + shapeVal.shape.y3) / 2;
    
                        this.dragOffset = {
                            x: e.clientX - centerX,
                            y: e.clientY - centerY
                        };
                        break;
    
                    case "circle":
                        this.dragOffset = {
                            x: e.clientX - shapeVal.shape.centerX,
                            y: e.clientY - shapeVal.shape.centerY
                        };
                        break;
    
                    case "line":
                    case "arrow":
                        this.dragOffset = {
                            x: e.clientX - shapeVal.shape.x1,
                            y: e.clientY - shapeVal.shape.y1
                        };
                        break;
    
                    case "pencil":
                        this.dragOffset = {
                            x: e.clientX - shapeVal.shape.points[0].x,
                            y: e.clientY - shapeVal.shape.points[0].y
                        };
                        break;
                }
                this.clearCanvas(); 

            }
        }
    };
    
    mouseUpHandler = (e:MouseEvent) => {
        this.clicked = false
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
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
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255, 255, 255)"
            const selectedTool = this.selectedTool;
            console.log(selectedTool)
            if (selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);   
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            }
            else if(selectedTool === 'pencil'){
                const currentX = e.clientX;
                const currentY = e.clientY;
            
                this.pencilPath.push({ x: currentX, y: currentY });
            
                this.ctx.beginPath();
                for (let i = 0; i < this.pencilPath.length - 1; i++) {
                    this.ctx.moveTo(this.pencilPath[i].x, this.pencilPath[i].y);
                    this.ctx.lineTo(this.pencilPath[i + 1].x, this.pencilPath[i + 1].y);
                }
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.closePath();

            }else if(selectedTool === 'diamond'){
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
    
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, this.startY); // Top point
                this.ctx.lineTo(this.startX, centerY); // Left point
                this.ctx.lineTo(centerX, this.startY + height); // Bottom point
                this.ctx.lineTo(this.startX + width, centerY); // Right point
                this.ctx.closePath();
                this.ctx.stroke();
                this.diamondCoords.P1 = {x:centerX,y:this.startY}
                this.diamondCoords.P2 = {x:this.startX,y:centerY}
                this.diamondCoords.P3 = {x:centerX,y:this.startY+height}
                this.diamondCoords.P4 = {x:this.startX+width,y:centerY}
                console.log("diamond coors",this.diamondCoords)

                

            }
            else if(selectedTool === 'line'){
                this.ctx.beginPath()
                this.ctx.moveTo(this.startX,this.startY)
                this.ctx.lineTo(e.clientX,e.clientY)
                this.ctx.stroke();

                this.lineCoords.P1= {x:this.startX,y:this.startY}
                this.lineCoords.P2= {x:e.clientX,y:e.clientY}

            }
            else if(selectedTool === 'arrow'){
                const headlen = 14; // Length of arrowhead
                const angle = Math.atan2(e.clientY - this.startY, e.clientX - this.startX);
            
                this.ctx.beginPath();
                this.ctx.lineCap = "round";
                this.ctx.lineWidth = 2.5; // Adjust for better visibility
            
                // Draw main line
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                this.arrowCoords.P1= {x:this.startX,y:this.startY}
                this.arrowCoords.P2= {x:e.clientX,y:e.clientY}
                console.log("arrow",this.arrowCoords)
                
                // Calculate arrowhead points
                const arrowX1 = e.clientX - headlen * Math.cos(angle - Math.PI / 6);
                const arrowY1 = e.clientY - headlen * Math.sin(angle - Math.PI / 6);
                const arrowX2 = e.clientX - headlen * Math.cos(angle + Math.PI / 6);
                const arrowY2 = e.clientY - headlen * Math.sin(angle + Math.PI / 6);
                
                // Draw arrowhead
                this.ctx.moveTo(e.clientX, e.clientY);
                this.ctx.lineTo(arrowX1, arrowY1);
                
                this.ctx.moveTo(e.clientX, e.clientY);
                this.ctx.lineTo(arrowX2, arrowY2);
            
                this.ctx.stroke();

            }
            else if(selectedTool === 'eraser'){
                let shapeVal: shapeArrayType | undefined = this.existingShapes.find(({ shape }) =>
                    this.isPointInsideShape(e.clientX, e.clientY, shape)
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
            switch (this.clickedShape.shape.type) {
                case "rect":
                    this.clickedShape.shape.x = e.clientX - this.dragOffset.x;
                    this.clickedShape.shape.y = e.clientY - this.dragOffset.y;
                    break;
        
                case "diamond":
                    let dxDiamond = e.clientX - this.dragOffset.x;
                    let dyDiamond = e.clientY - this.dragOffset.y;
                
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
                    this.clickedShape.shape.centerX = e.clientX - this.dragOffset.x;
                    this.clickedShape.shape.centerY = e.clientY - this.dragOffset.y;
                    break;
        
                case "line":
                case "arrow":
                    let moveX = e.clientX - this.dragOffset.x;
                    let moveY = e.clientY - this.dragOffset.y;
                
                    let lineOffsetX = moveX - this.clickedShape.shape.x1;
                    let lineOffsetY = moveY - this.clickedShape.shape.y1;
                
                    this.clickedShape.shape.x1 += lineOffsetX;
                    this.clickedShape.shape.y1 += lineOffsetY;
                    this.clickedShape.shape.x2 += lineOffsetX;
                    this.clickedShape.shape.y2 += lineOffsetY;
                    break;
        
                case "pencil":
                    let moveDeltaX = e.clientX - this.dragOffset.x;
                    let moveDeltaY = e.clientY - this.dragOffset.y;
                    
                    this.clickedShape.shape.points = this.clickedShape.shape.points.map(point => ({
                        x: point.x + moveDeltaX - this.clickedShape.shape.points[0].x,
                        y: point.y + moveDeltaY - this.clickedShape.shape.points[0].y
                    }));
                    break;
            }
            this.clearCanvas();
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
