import { Router } from "express";
import { createUser, getUser, getUserById } from "../services/user-service.js";
import { Request, Response } from "express";
import { AuthenticatedRequest, authMiddleware } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const usersRouter = Router();

usersRouter.get("/me", authMiddleware , async (req : AuthenticatedRequest, res : Response) => {
    const userId = req.userId;
    const user = await getUserById(userId);
    if(!user){
        return res.status(404).json({msg : "User not found"});
    }
    return res.status(200).json(user);
})

usersRouter.post("/register", async (req : Request, res : Response) => {
    const { email, username, password } = req.body;
    const user = await createUser(email, username, password);
    if(!user){
        return res.status(500).json({msg : "Failed to create user"});
    }
    return res.status(200).json(user);
})

usersRouter.post("/login", async (req : Request, res : Response) => {
    const { email, password } = req.body;
    const user = await getUser(email, password);
    if(!user){
        return res.status(500).json({msg : "Failed to login"});
    }
    const token = jwt.sign({ userId : user.id, role : user.role }, process.env.JWT_SECRET!);
    return res.status(200).json({ token, user });
})


export default usersRouter;