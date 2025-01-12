import { NextFunction,Request,Response } from "express";

export const middleware = (req:Request,res:Response,next:NextFunction)=>{

    next()
}