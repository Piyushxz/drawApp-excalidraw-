import express from "express";
import { middleware } from "./middleware";
import {signUpSchema,signin,createRoomSchema} from "@repo/common/types"
import {z} from "zod"
const app = express()



app.post("/signup",(req,res)=>{
    const {username,password,email} = req.body;

    const data = signUpSchema.safeParse(req.body)
    if(!data.success){
        res.status(400).json({message:"Invalid format"})
        return;
    }

})
app.post("/signin",(req,res)=>{
        const {username,password} = req.body;

    const data = signin.safeParse(req.body)
    if(!data.success){
        res.status(400).json({message:"Invalid format"})
        return;
    }
})

app.post("/createroom",middleware,(req,res)=>{
    
    const data = createRoomSchema.safeParse(req.body)
    if(!data.success){
        res.status(400).json({message:"Invalid format"})
        return;
    }
})



app.listen(3008)