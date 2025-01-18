import axios from "axios"
import { BACKEND_URL } from "../../../config"
import ChatRoom from "../../components/ChatRoom"

async function getID(){
    try{
        const reponse = await axios.get(`${BACKEND_URL}/room/red2`)
        console.log(reponse)
        return reponse.data.roomId
    }
    catch(e){
        console.log(e)
    }

}

export default async function ChatBox(){
    const id = await getID()
    console.log(id)
    return <ChatRoom  id={id}/>
}