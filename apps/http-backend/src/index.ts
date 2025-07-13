import express from "express";
import { middleware } from "./middleware";
import {signUpSchema,signin,createRoomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"
import {JWT_SECRET } from "@repo/backend-common/config"
import jwt from "jsonwebtoken"
import cors from "cors"
const app = express()

app.use(express.json())
app.use(cors())



app.post("/signup",async (req,res)=>{

    const data =  signUpSchema.safeParse(req.body)
    if(!data.success){
        res.status(400).json({message:"Invalid format"})
        return;
    }


    try{
        let user = null
        user = await prismaClient.user.findFirst({
            where:{
                username:data.data.username,
                email:data.data.email
            }
        })

        if(user){
            res.status(409).json({message:"User Already Exists"})
            return;
        }
        
        await prismaClient.user.create({
            data:{
                username:data.data.username,
                email:data.data.email,
                password:data.data.password,

            }
        })

        res.status(200).json({message:"User created successfully!"})
    }catch(e){
        res.status(500).json({message:"Could no signUp"})
        console.log(e)
    }

})
app.post("/signin",async (req,res)=>{

    const data = signin.safeParse(req.body)
    console.log(data)
    if(!data.success){
        res.status(400).json({message:"Invalid format"})
        return;
    }

    try{
        let foundUser = null;

        foundUser = await prismaClient.user.findFirst({where:
            {
                email:data.data.email,
                password:data.data.password
            }
        })

        if(!foundUser){
            res.status(404).json({message:"Invalid Credentials"})
            return;
        }

        const token = jwt.sign({id:foundUser.id},JWT_SECRET)

        res.status(200).json({message:"Signed In successfully!",token:token})


    }catch(e){
        res.status(500).json({message:"Could no signUp"})

    }
})

app.get("/rooms",middleware,async (req,res)=>{

    const userId  = req.userId;

    if (!userId) {
        res.status(400).json({ message: "User not authenticated" });
        return
     }

     try{

        const rooms = await prismaClient.room.findMany({
            where:{
                adminId:userId
            }
        })


        res.status(200).json({rooms})
     }
     catch(e){
        res.status(500).json({message:"Server error"})
     }

})
app.delete("/rooms",middleware,async (req,res)=>{

    const userId  = req.userId;
    const roomId = req.body.id

    if (!userId) {
        res.status(400).json({ message: "User not authenticated" });
        return
     }

     try{

        const room = await prismaClient.room.delete({
            where:{
                adminId:userId,
                id:roomId
            }
        })


        res.status(200).json({room:room,message:"Room deleted succesfully"})
     }
     catch(e){
        res.status(500).json({message:"Server error"})
     }

})




app.post("/createroom",middleware,async (req,res)=>{
    const userId = req.userId;

    if (!userId) {
         res.status(400).json({ message: "User not authenticated" });
         return
      }
    
    const parsedData = createRoomSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message:"Invalid format"})
        return;
    }

    try{
        const room = await prismaClient.room.create({
            data:{
                slug:parsedData.data.roomName,
                adminId:userId
            }
        })
        res.status(200).json({message:`${parsedData.data.roomName} created!`,id:room.id})
    }
    catch(e){
        res.status(500).json({message:"Room already exists."})
    }
})

app.post('/create-random-room',async(req,res)=>{
    try{
        const adminId = req.body.adminId
        const roomName = `room-${Math.random().toString(36).substring(2, 15)}`;
        const room = await prismaClient.room.create({
            data:{
                slug:roomName,
                adminId 
            }
        })
        res.status(200).json({message:`${roomName} created!`,id:room.id})
    }catch(e){
        res.status(500).json({message:"Could not create room"})
    }
})

app.get("/chats/:roomId",async (req,res)=>{

    const roomId = Number(req.params.roomId);

    try{
        const room = await prismaClient.room.findFirst({
            where:{
                id:roomId
            }
        })

        if(!room){
            res.status(404).json({message:"Could Not find room"})
            return;
        }
        const chats = await prismaClient.chat.findMany({
            where:{
                roomId:roomId
            },
            orderBy:{
                id:"desc"
            },
            take:50
            
        })
    
        res.json({chats})

    }catch(e){
        res.status(500).json({message:"Could not get chats"})
        console.log(e)
    }

})

app.delete("/deleteshape",middleware,async (req,res)=>{

    const userId = req.userId
    const id = req.body.id
    if (!userId) {
        res.status(400).json({ message: "User not authenticated" });
        return
     }
   
     try{

       const shape = await prismaClient.chat.delete({
        where:{
            id:id,
            
        }
       })

       res.status(201).json({message:"Shape deleted ",shape})
     }catch(e){
        res.status(500).json({message:"Cound not delete shape"})
        console.log(e)
     }
})
app.get("/room/:slug",async (req,res)=>{
    const slug = req.params.slug;

    try{
        const room = await prismaClient.room.findFirst({
            where:{
                slug
            }
        })

        if(!room){
            res.status(404).json({message:"Room Does Not exist"});
            return;
        }

        res.status(200).json({roomId:room.id,slug:room.slug})
    }

    catch{
        res.status(500).json({message:"Error finding room"})
    }

})
app.listen(3008)