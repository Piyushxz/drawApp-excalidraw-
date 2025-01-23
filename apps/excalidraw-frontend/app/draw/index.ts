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
            const shape = parsedMessage.message
            allShapes.push(shape)
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
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const shape:Shape={
            type:"rect",
            x:startX,
            y:startY,
            width,
            height
        }
        allShapes.push(shape)


        socket.send(JSON.stringify({
            type:'chat',
            message:JSON.stringify({shape})
        }))
    }
    )

    canvas?.addEventListener('mousemove',(e)=>{
    
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx?.clearRect(0,0,canvas.width,canvas.height)

            clearCanvas(allShapes,canvas,ctx);
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx?.strokeRect(startX,startY,width,height)




            
        }
    })
}

function clearCanvas(allShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){

    allShapes.map((shape)=>{

        if(shape.type == "rect"){
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx?.strokeRect(shape.x,shape.y,shape.width,shape.height)
        }
    })
}

async function getExisitingShapes(roomId:string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    const messages =  res.data.chats

    const shapes = messages.map((x:{message:string})=>{
        const messageData = JSON.parse(x.message)
        return messageData
    })

    return shapes;
}