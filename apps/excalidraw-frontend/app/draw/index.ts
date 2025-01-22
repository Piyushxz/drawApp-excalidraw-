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
   
const allShapes :Shape[]=[]


export function initDraw(canvas:HTMLCanvasElement){
    const ctx = canvas?.getContext('2d')

    if(!ctx){
        return;
    }
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

        allShapes.push({
            type:"rect",
            x:startX,
            y:startY,
            width,
            height
        })
    })
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