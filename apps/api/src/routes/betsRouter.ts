import { Router } from "express";
import { Request, Response } from "express";
import { AuthenticatedRequest, authMiddleware } from "../middleware/auth.js";
import { getUserBets, placeBet } from "../services/bets-service.js";

const betsRouter = Router();

betsRouter.post("/place-bet", authMiddleware, async (req : AuthenticatedRequest, res : Response) => {
    const { userId, role } = req;
    if(!userId || role !== "user"){
        return res.status(401).json({msg : "Unauthorized, token is invalid"})
    }
    const { marketId, amount, choice } = req.body as { marketId : string, amount : number, choice : boolean };
    if(!marketId || !amount || !choice){
        return res.status(400).json({msg : "Market ID, amount and choice are required"})
    }

    const result = await placeBet(userId, marketId, amount, choice);
    
    if(!result || !result.Bet){
        return res.status(500).json({msg : "Failed to place bet"})
    }
    return res.status(200).json({
        Bet : result.Bet,
        User : result.User,
        Market : result.Market
    });
})

betsRouter.get("/my-bets", authMiddleware, async (req : AuthenticatedRequest, res : Response) => {
    const { userId, role } = req;
    if(!userId || role !== "user"){
        return res.status(401).json({msg : "Unauthorized, token is invalid"})
    }
    const { marketId } = req.query as { marketId : string };
    if(!marketId || typeof marketId !== 'string'){
        return res.status(400).json({msg : "Market ID is required"})
    }
    const bets = await getUserBets(marketId, userId);
    if(!bets){
        return res.status(404).json({msg : "Bets not found"})
    }
    return res.status(200).json(bets);
})



export default betsRouter;