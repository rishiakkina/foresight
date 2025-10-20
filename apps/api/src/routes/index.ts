import { Router } from "express";
import betsRouter from "./betsRouter.js"
import marketsRouter from "./marketsRouter.js"
import usersRouter from "./usersRouter.js"


const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World");
});

router.use("/bets", betsRouter);
router.use("/markets", marketsRouter);
router.use("/users", usersRouter);

export default router;
