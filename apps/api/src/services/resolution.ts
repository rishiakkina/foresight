import prismaClient from "@foresight/db";

const resolveMarket = async (marketId :  string, result : boolean) => {
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

        
    }catch(err){
        console.log(`An error occured : ${err}`)
        return;
    }
}