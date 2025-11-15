import prismaClient from "@foresight/db";
// import { Queue } from "bullmq";
// import  { Worker } from "bullmq";

// const redisConnection = {
//     host : process.env.REDIS_HOST,
//     port : Number(process.env.REDIS_PORT),
// }

// export const marketQueue = new Queue("market-queue", { connection : redisConnection });

// export const worker = new Worker("close-market", async (job) => {
//     try{
//         const { marketId } = job.data;
//         await prismaClient.market.update({
//             where : { id : marketId},
//             data : { status : "locked"}
//         })
//         console.log(`Market ${marketId} closed automatically at deadline.`);
//     }catch(err){
//         console.log(`An error occured : ${err}`)
//         return;
//     }
// },{ connection : redisConnection })

export const resolveMarket = async (marketId :  string, result : boolean) => {
    try{
        if(!marketId){
            throw new Error("Market ID doesn't exist");
        }
        const market = await prismaClient.market.findUnique({
            where : {
                id : marketId
            }
        })
        if(!market){
            throw new Error("Market not found");
        }

        if(market.status !== "active"){
            throw new Error("Market is not active");
        }

        if(market.status !== "locked"){
            throw new Error("Market is yet to close")
        }

        const updatedMarket = await prismaClient.market.update({
            where : {
                id : marketId
            },
            data : {
                status : "resolved",
                outcome : result
            }
        })

        return updatedMarket;

    }catch(err){
        console.log(`An error occured : ${err}`)
        return;
    }
}