import axios from "axios"
import { BACKEND_URL } from "../../config"
import ChatRoomClient from "./ChatRoomClient"

async function getMessage({id}:{id:string}) {
    const response =await axios.get(`${BACKEND_URL}/chats/${id}`)
    return response.data.chats
}

export default async function({id} :{id:string}){
    const messages = await getMessage({id})
    console.log(messages)
    return(
        <div className="w-screen h-screen bg-black flex justify-center items-center">
            <ChatRoomClient id={id} messages={messages}/>
        </div>
    )
}