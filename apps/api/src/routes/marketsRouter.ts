import { Router } from "express";
import { Request, Response } from "express";
import { AuthenticatedRequest, authMiddleware } from "../middleware/auth.js";
import { createMarket, getMarkets } from "../services/markets-service.js";

const marketsRouter = Router();

marketsRouter.get("/", async (req : Request, res : Response) => {
    const markets = await getMarkets(null);
    if(!markets){
        return res.status(500).json({msg : "Failed to fetch markets"})
    }
    return res.status(200).json(markets);
})

marketsRouter.get("/:id", async (req : Request, res : Response) => {
    const { id } = req.params as { id : string };
    const market = await getMarkets(id);
    if(!market){
        return res.status(500).json({msg : "Failed to fetch market"})
    }
    return res.status(200).json(market);
})

marketsRouter.post("/", authMiddleware, async (req : AuthenticatedRequest, res : Response) => {
    const { userId } = req;
    if(!userId){
        return res.status(401).json({msg : "Unauthorized, token is invalid"})
    }
    const { title, description, category, resolutionDeadline } = req.body as { title : string, description : string, category : string, resolutionDeadline : Date };
    const market = await createMarket( userId, { title, description, category, resolutionDeadline });
    if(!market){
        return res.status(500).json({msg : "Failed to create market"})
    }
    return res.status(200).json(market);
})

export default marketsRouter;