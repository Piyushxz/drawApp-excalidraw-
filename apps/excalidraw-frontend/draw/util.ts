import { BACKEND_URL } from "@/config"
import axios from "axios"

export async function getExisitingShapes(roomId:string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    const messages =  res.data.chats
    console.log("response",messages)


    const shapes2 = messages.map(({id,message}:{id:number,message:string})=>{
        const messageData = JSON.parse(message)
        return {id,shape:messageData.shape,color:messageData?.color || "#ffffff",strokeWidth:messageData?.strokeWidth || 2
        }})
    


    return shapes2;
}


