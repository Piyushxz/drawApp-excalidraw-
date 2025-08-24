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
        console.log(data)
        let parsedData;
        if (typeof data !== "string") {
          parsedData = JSON.parse(data.toString());
        } else {
          parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
        }
        console.log(parsedData)

        if(parsedData.type ==="join_room"){
            console.log("User joined ",parsedData.roomId)
            const user = users.find(x => x.ws === ws);
            user?.room.push(parsedData.roomId)
        }

        if(parsedData.type === "leave_room"){
            const  user  = users.find(x=> x.ws === ws);

            if(!user){
                return;
            }
            user.room = user?.room.filter( x => x === parsedData.roomId)
        }

        console.log("message received")

        if(parsedData.type === "chat"){
            console.log(parsedData)
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            console.log("Inserting into DB",      {  
            roomId:Number(roomId),
            message:message,
            userId:userAuthenticated})
            let shape = null
            try {
                shape = await prismaClient.chat.create({
                  data: {
                    roomId: Number(parsedData.roomId),
                    message: parsedData.message,
                    userId: userAuthenticated,
                  },
                });
                console.log("Message inserted successfully.");
              } catch (error) {
                console.error("Error inserting into DB:", error);
              }
            users.forEach(user => {
                if (user.room.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        id:shape?.id,
                        roomId:roomId
                    }))
                }
            })
        }

        else if(parsedData.type === "delete_shape"){
            console.log(parsedData)
            try{
                await prismaClient.chat.delete({
                    where:{
                        id:parsedData.shape,
                        roomId:Number(parsedData.roomId)
                    }
                })
                console.log("deleted succesfully")
            }
            catch(e){
                console.log(e)
            }
            console.log(parsedData.sentBy,"<- token")

            users.forEach(user => {
                // &&  parsedData.sentBy!== token
                if (user.room.includes(parsedData.roomId) ){
                    user.ws.send(JSON.stringify({
                        type:"delete_shape",
                        id:parsedData.shape,
                        roomId:parsedData.roomId,
                        sentBy:parsedData.sentBy
                    }))
                }
                // if(parsedData.sentBy === token){
                //     user.ws.send(JSON.stringify({
                //         type:"local_delete_shape",
                //         id:parsedData.shape,
                //         sentBy:parsedData.sentBy
                //     }))
                // }
            })
        }
            else if(parsedData.type === "update_shape"){
                console.log(parsedData)
                let shape = JSON.parse(parsedData.message)
                console.log("id ", shape?.shape.id , "shape ", shape.shape.shape)
                console.log("stringfy ", JSON.stringify(shape.shape))
                try{
                    await prismaClient.chat.update({
                        data:{
                           message:JSON.stringify(shape.shape) 
                        },
                        where:{
                            id:shape?.shape?.id,
                            roomId:Number(parsedData?.roomId)
                        }
                    })
                    console.log("message updated succesfully")
                }catch(e){
                    console.log("Could not delete shape")
                    console.log(e)
                }

                users.forEach(user => { 
                    if (user.room.includes(parsedData.roomId) ){
                        user.ws.send(JSON.stringify({
                            type:"update_shape",
                            shape:shape.shape,
                            roomId:parsedData.roomId,
                            sentBy:parsedData.sentBy
                        }))
                    }
                })
                
            
                
            }
            else if(parsedData.type === "update_shape_color"){
                console.log("update_shape_color .,99", parsedData)
                
                // Handle the new format where shape is sent directly
                if (parsedData.shape) {
                    let updatedShape = {
                        ...parsedData?.shape,
                        color: parsedData?.color
                    }
                    console.log("updatedShape ", updatedShape)
                    
                    // Broadcast to other users
                    users.forEach(user => { 
                        if (user.room.includes(parsedData.roomId) && parsedData.sentBy !== user.userId){
                            user.ws.send(JSON.stringify({
                                type: "update_shape_color",
                                id: parsedData.id,
                                shape: updatedShape,
                                color: parsedData.color,
                                roomId: parsedData.roomId,
                                sentBy: parsedData.sentBy
                            }))
                        }
                    })
                    try{
                        await prismaClient.chat.update({
                            data:{
                                message:JSON.stringify(updatedShape)
                            },
                            where:{
                                id:parsedData.id,
                                roomId:Number(parsedData.roomId)
                            }
                        })
                        console.log("shape updated succesfully")
                    }
                    catch(err){
                        console.log("Could not update shape")
                        console.log(err)
                    }
                }
            }
            else if(parsedData.type === "update_shape_stroke_width"){
                console.log("update_shape_stroke_width", parsedData)
                
                // Broadcast to other users
                let updatedShape = {
                    ...parsedData?.shape,
                    strokeWidth: parsedData?.strokeWidth
                }

                let mes = {  type: "update_shape_stroke_width",
                id: parsedData.id,
                shape: updatedShape,
                roomId: parsedData.roomId,
                sentBy: parsedData.sentBy}

                console.log("mes ", mes)
                users.forEach(user => { 
                    if (user.room.includes(parsedData.roomId) && parsedData.sentBy !== user.userId){
                        user.ws.send(JSON.stringify(mes))
                    }
                })

                try{
                    await prismaClient.chat.update({
                        data:{
                            message:JSON.stringify(updatedShape)
                        },
                        where:{
                            id:parsedData.id,
                            roomId:Number(parsedData.roomId)
                        }
                    })
                    console.log("shape updated succesfully")
                }
                catch(err){
                    console.log("Could not update shape")
                    console.log(err)
                }
            }
            else if(parsedData.type === "text"){
                console.log("text message received", parsedData)
                const roomId = parsedData.roomId;
                const message = parsedData.message;
                const userId = parsedData.sentBy;
                const textShape = {
                    shape: {
                        type: "text",
                        x: parsedData.x,
                        y: parsedData.y,
                        text: parsedData.text,
                        fontSize:parsedData.fontSize,
                        fontFamily:parsedData.fontFamily
                    }
                }
                try{
                    console.log("textShape ", textShape)
                    const dbShape = await prismaClient.chat.create({
                        data:{
                            roomId:Number(roomId),
                            message:JSON.stringify(textShape),
                            userId:userAuthenticated
                        }
                    })

                    users.forEach(user => {
                        if (user.room.includes(roomId)){
                            user.ws.send(JSON.stringify({
                                type:"text",
                                x: parsedData.x,
                                y: parsedData.y,
                                text: parsedData.text,
                                fontSize:parsedData.fontSize,
                                fontFamily:parsedData.fontFamily,
                                id:dbShape?.id,
                                roomId:roomId
                            }))
                        }
                    })
                }catch(err){
                    console.log(err)
                }



            }
            else if(parsedData.type === "update_shape_text"){
                console.log("update_shape_text", parsedData)
                const roomId = parsedData.roomId;
                const message = parsedData.message;
                const userId = parsedData.sentBy;
                console.log("parsedData 6969",parsedData)

                users.forEach(user => {
                    if (user.room.includes(roomId) ){
                        user.ws.send(JSON.stringify({
                            type:"update_shape_text",
                            id:parsedData.id,
                            shape:parsedData.shape,
                            roomId:roomId,
                            sentBy:parsedData.sentBy
                }))
                    }
                })
                console.log("parsedData.shape",parsedData.shape)
                try{
                    await prismaClient.chat.update({
                        data:{
                            message:JSON.stringify(parsedData.shape.shape)
                        },
                        where:{
                            id:parsedData.id,
                            roomId:Number(parsedData.roomId)
                        }
                    })
                }
                catch(err){
                    console.log("Could not update shape")
                    console.log(err)
                }
                console.log("shape updated succesfully")
            }
            else if(parsedData.type === "clear_canvas"){
                console.log("clear_canvas", parsedData)
                users.forEach(user => {
                    if (user.room.includes(parsedData.roomId)){
                        user.ws.send(JSON.stringify({
                            type:"clear_canvas",
                            roomId:parsedData.roomId,
                            sentBy:parsedData.sentBy
                        }))
                    }
                })
                try{
                    await prismaClient.chat.deleteMany({
                        where:{
                            roomId:Number(parsedData.roomId)
                        }
                    })
                }
                catch(err){
                    console.log("Could not clear canvas")
                    console.log(err)
                }
            }
            
    })


})


