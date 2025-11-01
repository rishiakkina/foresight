import prismaClient from "@foresight/db"

interface Market {
    title : string,
    description : string,
    category : string,
    resolutionDeadline : Date
}
const createMarket = async (id : string, market : Market) => {
    try {
        if(!market.title || !market.resolutionDeadline){
            throw new Error("Required credentials not available");
        }
        const existingMarket = await prismaClient.market.findUnique({
            where : {
                title : market.title
            }
        })
        if(existingMarket){
            throw new Error("Market with title already exists!!!")
        }
        const newMarket = await prismaClient.market.create({
            data : {
                title : market.title,
                description : market.description,
                category : market.category,
                resolutionDeadline : market.resolutionDeadline,
                creatorId : id
            }
        })
        return newMarket;
    } catch (err) {
        console.log(`An error occured : ${err}`)
        return;
    }    
}

const getMarkets = async (id : string | null) => {
    try {
        let markets : Market[] = [];
        if(!id){
            markets = await prismaClient.market.findMany()
        } else {
            markets = await prismaClient.market.findMany({
                where : {
                    creatorId : id
                }
            })
        }if(markets.length === 0){
            throw new Error("Markets not found")
        }
        return markets;
    } catch (err) {
        console.log(`An error occured : ${err}`)
        return;
    }
}

export { createMarket, getMarkets };

