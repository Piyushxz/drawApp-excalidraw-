import { Tool } from "@/components/ShapeOptionBar";
import { getExisitingShapes } from "./util";

type Shape = {
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
}
    |
{
    type :"circle",
    x:number,
    y:number,
    radius:number

}
 
export class Game{
    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private exisitingShapes :Shape[];
    private roomId:string
    private socket:WebSocket
    private clicked:boolean
    private startX:number =0
    private startY:number=0
    public selectedTool :Tool = 'rect'

    constructor(canvas:HTMLCanvasElement ,roomId:string ,socket:WebSocket ){
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')!
        this.exisitingShapes=[]
        this.roomId = roomId
        this.socket = socket
        this.clicked = false
        
        this.init();
        this.initHandler();
        this.initMouseHandler();

    }

    destroy(){
        this.canvas.removeEventListener('mousedown',this.mouseDownHandler)
        this.canvas.removeEventListener('mouseup',this.mouseUpHandler)

        this.canvas.removeEventListener('mousemove',this.mouseMoveHandler)
       
    }
    setShape(tool :Tool){
        this.selectedTool = tool
    }
     async init(){
        this.exisitingShapes = await getExisitingShapes(this.roomId)
        console.log(this.selectedTool)
        this.clearCanvas()
    }

    initHandler(){
        this.socket.onmessage=(event)=>{
            const parsedMessage = JSON.parse(event.data)
            console.log("on message",this.selectedTool)
            if(parsedMessage.type ==="chat"){
                const shape = JSON.parse(parsedMessage.message)
                console.log("shape socket",shape.shape)
                this.exisitingShapes.push(shape.shape)
                this.clearCanvas();
    
            }
        }
    }
    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
    
        this.exisitingShapes.map((shape)=>{
    
            if(shape.type == "rect"){
                this.ctx.strokeStyle = "rgba(255,255,255)"
                this.ctx?.strokeRect(shape.x,shape.y,shape.width,shape.height)
            }
            else if(shape.type === 'circle'){
    
                this.ctx.beginPath();
                this.ctx.arc(shape.x,shape.y,Math.abs(shape.radius),0,Math.PI*2);
                this.ctx.stroke()
                this.ctx.closePath()
            }
        })
    }


    mouseDownHandler=(e)=>{
        this.clicked = true;
        this.startX = e.clientX
        this.startY = e.clientY
            
    }
    mouseUpHandler =(e)=>{
        this.clicked = false;
        let shape:Shape | null = null;

        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        const selectedTool = this.selectedTool
        console.log("sending message type",selectedTool)
        if(selectedTool === 'rect'){
            shape={
                type:'rect',
                x:this.startX,
                y:this.startY,
                width,
                height
            }
            
    
        }
        else if(selectedTool === 'circle'){
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

             shape = {
                type:'circle',
                radius:radius,
                x:this.startX +radius +2,
                y:this.startY+radius +2
            }

        }
        if(!shape){
            return;
        }

        this.exisitingShapes.push(shape)



        this.socket.send(JSON.stringify({
            type:'chat',
            message:JSON.stringify({shape}),
            roomId:this.roomId
        }))
    }

    mouseMoveHandler=(e)=>{
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255,255,255)"
            const selectedTool = this.selectedTool
            if(selectedTool === 'rect'){
                this.ctx.strokeRect(this.startX,this.startY,width,height)

            }
            else if(selectedTool === 'circle'){
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
    
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }




            
        }
    }
    

    initMouseHandler(){
        this.canvas.addEventListener('mousedown',this.mouseDownHandler)
        this.canvas.addEventListener('mouseup',(e)=>this.mouseUpHandler(e))

        this.canvas.addEventListener('mousemove',(e)=>this.mouseMoveHandler(e))
        
    
    }
}