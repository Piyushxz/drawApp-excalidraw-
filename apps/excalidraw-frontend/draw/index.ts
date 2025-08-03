import { BACKEND_URL } from "@/config";
import axios from "axios";
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
   
export async function initDraw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
    

    const ctx = canvas?.getContext('2d')

    if(!ctx){
        return;
    }
    const allShapes :Shape[]= await getExisitingShapes(roomId)
    console.log(allShapes)
    socket.onmessage=(event)=>{
        const parsedMessage = JSON.parse(event.data)

        if(parsedMessage.type ==="chat"){
            const shape = JSON.parse(parsedMessage.message)
            console.log("shape socket",shape.shape)
            allShapes.push(shape.shape)
            clearCanvas(allShapes,canvas,ctx);

        }
    }


    clearCanvas(allShapes,canvas,ctx);

    ctx?.strokeRect(25,25,100,100);

    let clicked = false;
    let startX =0;
    let startY=0;
    canvas?.addEventListener('mousedown',(e)=>{
        clicked = true;
        startX = e.clientX
        startY = e.clientY
        
    })

    canvas?.addEventListener('mouseup',e=>{
        clicked = false;
        let shape:Shape | null = null;

        const width = e.clientX - startX;
        const height = e.clientY - startY;
         //@ts-ignore
        const selectedTool = window.selectedTool
        if(selectedTool === 'rect'){
            shape={
                type:'rect',
                x:startX,
                y:startY,
                width,
                height
            }
            
    
        }
        else if(selectedTool === 'circle'){
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

             shape = {
                type:'circle',
                radius:radius,
                x:startX +radius +2,
                y:startY+radius +2
            }

        }
        if(!shape){
            return;
        }

        allShapes.push(shape)



        socket.send(JSON.stringify({
            type:'chat',
            message:JSON.stringify({shape}),
            roomId:roomId
        }))
    }
    )

    canvas?.addEventListener('mousemove',(e)=>{
        

        
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            clearCanvas(allShapes,canvas,ctx);
            ctx.strokeStyle = "rgba(255,255,255)"
            //@ts-ignore
            const selectedTool = window.selectedTool
            if(selectedTool === 'rect'){
                ctx.strokeRect(startX,startY,width,height)

            }
            else if(selectedTool === 'circle'){
                const centerX = startX + width / 2;
                const centerY = startY + height / 2;
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
    
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
            }




            
        }
    })
}

function clearCanvas(allShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    allShapes.map((shape)=>{

        if(shape.type == "rect"){
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx?.strokeRect(shape.x,shape.y,shape.width,shape.height)
        }
        else if(shape.type === 'circle'){

            ctx.beginPath();
            ctx.arc(shape.x,shape.y,shape.radius,0,Math.PI*2);
            ctx.stroke()
            ctx.closePath()
        }
    })
}

async function getExisitingShapes(roomId:string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    const messages =  res.data.chats
    console.log("response",messages)

    const shapes = messages.map((x:{message:string})=>{
        const messageData = JSON.parse(x.message)
        return messageData.shape
    })

    return shapes;
}