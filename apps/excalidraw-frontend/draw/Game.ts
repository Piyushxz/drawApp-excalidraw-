import { Tool } from "@/components/ShapeOptionBar";
import { getExisitingShapes } from "./util";
interface Point {
    x:number,
    y:number
}

type Shape = {
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
    x1:Number,
    y1:Number,
    x2:Number,
    y2:Number,
    x3:Number,
    y3:Number,
    x4:Number,
    y4:Number,
    
    

}


export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private pencilPath : Point[] = []
    private selectedTool: Tool = "circle";

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
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: "circle" | "pencil" | "rect" | "diamond") {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExisitingShapes(this.roomId);
        console.log(this.existingShapes);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                console.log("parsedSHape",parsedShape)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        console.log("")
        this.existingShapes.map((shape) => {
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

        if (!shape) {
            return;
        }

         this.existingShapes.push(shape)

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

            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    

    }
}