import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface AuthenticatedRequest extends Request {
    userId? : string;
}



export const authMiddleware : RequestHandler = (req : AuthenticatedRequest, res : Response, next : NextFunction) => {
    const token = req.headers["authorization"]
    if(!token){
        return res.status(401).json({msg : "No token, auth failed"})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    if(!decoded || typeof decoded === 'string'){
        return res.status(401).json({msg : "Invalid token, auth failed"})
    }
    req.userId = decoded.userId;
    next();
}


export const adminMiddleware : RequestHandler = (req : AuthenticatedRequest, res : Response, next : NextFunction) => {
    const token = req.headers["authorization"]
    if(!token){
        return res.status(401).json({msg : "No token, auth failed"})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    if(!decoded || typeof decoded === 'string'){
        return res.status(401).json({msg : "Invalid token, auth failed"})
    }
    req.userId = decoded.userId;
    next();
}

