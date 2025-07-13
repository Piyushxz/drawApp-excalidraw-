import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import  {JWT_SECRET}  from "@repo/backend-common/config";
declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }
  
export const middleware = (req:Request,res:Response,next:NextFunction)=>{

    const token = req.headers.token ;
        const decoded = jwt.verify(token as string, JWT_SECRET) as JwtPayload ;
        req.userId = decoded.id;
        next();
      

}