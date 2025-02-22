import { Tool } from "@/components/ShapeOptionBar";
import { getExisitingShapes } from "./util";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { isPointInsidePolygon, isPointNearLine, isPointNearPencilPath } from "./deleteFunctionality";

interface shapeArrayType{
    id:number,
    shape:Shape
}
interface Point {
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
    private selectedTool: Tool = "circle";
    private diamondCoords: Diamond = {P1:{x:0,y:0},P2:{x:0,y:0},P3:{x:0,y:0},P4:{x:0,y:0}};
    private lineCoords : Line = {P1:{x:0,y:0},P2:{x:0,y:0}}
    private arrowCoords : Line = {P1:{x:0,y:0},P2:{x:0,y:0}}
    private clickedShapeIndex:any

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
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
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
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
        console.log("shape",this.existingShapes);

        this.clearCanvas();
    }

      async deleteShape(){
        console.log("delete called for",this.clickedShapeIndex)
        this.existingShapes = this.existingShapes.filter(({ id }) => id !== this.clickedShapeIndex);
    
        this.clearCanvas();       

        this.socket.send(JSON.stringify(
            {
                type:"delete_shape",
                id:this.clickedShapeIndex,
                roomId:this.roomId,
                sentBy : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlkZWRiMzE5LThlYWItNDFmMC04ZTNiLTljYTgzNzA3Njk5NSIsImlhdCI6MTczNjkyMDk1N30.8vT_oN-YGmcaQ8bM-Klg7W5O5vM7MFjp94wzQe-tVO0"
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
                const token = message.sentBy
                const id = JSON.parse(message.id)

                this.clickedShapeIndex = id
                this.deleteShape()
            }
            else if(message.type === 'local_delete_shape' ){
                this.clickedShapeIndex = JSON.parse(message.id)
                this.existingShapes = this.existingShapes.filter(({ id }) => id !== this.clickedShapeIndex);
                this.clearCanvas()
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map(({shape,id}) => {
            console.log("render shape ", shape , " id ",id)

            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            }
            else if(shape.type==='pencil')
            {
                console.log("rendering pencil",shape);

                for(let i = 0 ; i < shape.points.length-1;i++){
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.points[i].x,shape.points[i].y)
                    this.ctx.lineTo(shape.points[i+1].x,shape.points[i+1].y)
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();



                }
                

            }
            else if(shape.type === 'diamond'){
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.lineTo(shape.x3, shape.y3);
                this.ctx.lineTo(shape.x4, shape.y4);
                this.ctx.closePath();
                this.ctx.stroke();
            }
            else if(shape.type === 'line'){
                this.ctx.beginPath()
                this.ctx.moveTo(shape.x1,shape.y1)
                this.ctx.lineTo(shape.x2,shape.y2)
                this.ctx.stroke()
            }
            else if(shape.type === 'arrow'){
                console.log("rendering arrow",shape)
                const headlen = 14; // Length of arrowhead
                const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
            
                this.ctx.beginPath();
                this.ctx.lineCap = "round";
                this.ctx.lineWidth = 2.5; // Adjust for better visibility
            
                // Draw main line
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                
                // Calculate arrowhead points
                const arrowX1 = shape.x2 - headlen * Math.cos(angle - Math.PI / 6);
                const arrowY1 = shape.y2 - headlen * Math.sin(angle - Math.PI / 6);
                const arrowX2 = shape.x2 - headlen * Math.cos(angle + Math.PI / 6);
                const arrowY2 = shape.y2 - headlen * Math.sin(angle + Math.PI / 6);
                
                // Draw arrowhead
                this.ctx.moveTo(shape.x2, shape.y2);
                this.ctx.lineTo(arrowX1, arrowY1);
                
                this.ctx.moveTo(shape.x2, shape.y2);
                this.ctx.lineTo(arrowX2, arrowY2);
            
                this.ctx.stroke();
            }
            
        })
    }


    mouseDownHandler = (e:MouseEvent) => {


        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY

    }
    mouseUpHandler = (e:MouseEvent) => {
        this.clicked = false
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
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

        // this.existingShapes.push(shape)

          this.socket.send(JSON.stringify({
              type: "chat",
              message: JSON.stringify({
                 shape
            }),
            roomId: this.roomId
         }))
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
                let indexVal : shapeArrayType | undefined ;

                    indexVal = this.existingShapes.find(({shape}) => 
                        this.isPointInsideShape(e.clientX, e.clientY, shape)
                    );
            
                    if (indexVal) {
                        this.clickedShapeIndex = indexVal.id
                        console.log("index",this.clickedShapeIndex)
                        this.deleteShape();
                    }
                
        
            }
            
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    

    }
}