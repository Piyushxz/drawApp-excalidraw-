import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({port:8080})


function checkUser(token:string):string | null{
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        console.log(token)
        if(!decoded || !(decoded as JwtPayload).id){
        
            return null;
        }
        if(typeof decoded == "string"){
            return null
        }
        else{
            return decoded.id
        }
    }catch(e){
        return null;
        console.log(e)
    }


}


interface User{
    room : string[],
    userId : string,
    ws : WebSocket
}

const users : User[] = []


wss.on("connection",(ws,request)=>{

    const url = request.url


    if(!url){
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1])
    const token = queryParams.get('token') || ""

    const userAuthenticated = checkUser(token)

    if(!userAuthenticated){
        ws.close()
        return ;
    }

    users.push({userId:userAuthenticated,room:[],ws})

    ws.on('message', async(data)=>{

        const parsedData = JSON.parse(data as unknown as string);

        if(parsedData.type ==="join_room"){
            const user = users.find(x => x.ws === ws);
            user?.room.push(parsedData.roomId)
            console.log("User joined")
        }

        if(parsedData.type === "leave_room"){
            const  user  = users.find(x=> x.ws === ws);

            if(!user){
                return;
            }
            user.room = user?.room.filter( x => x === parsedData.roomId)
        }



        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await prismaClient.chat.create({
                data:{
                    roomId:roomId,
                    message:message,
                    userId:userAuthenticated
                }
            })

            users.forEach(user => {
                if (user.room.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId:roomId
                    }))
                }
            })
        }
    })


})


