import prismaClient from "@foresight/db";
import { Prisma } from "@prisma/client";

const placeBet = async (userId : string, marketId : string, amount : number, choice : boolean) => {
    try{
        const market = await prismaClient.market.findUnique({
            where : {
                id : marketId
            }
        })

        const oddsAtBet : number = market.yesShares / market.noShares
        if(!market){
            throw new Error("Market not found")
        }

        const user = await prismaClient.user.findUnique({
            where : {
                id : userId
            }
        })
        if(!user){
            throw new Error("User not found")
        }

        if(user.tokenBalance < amount){
            throw new Error("Insufficient funds")
        }

        const result = await prismaClient.$transaction(async (tx : Prisma.TransactionClient) => {
            const createdBet = await tx.bet.create({
                data : {
                    userId,
                    marketId,
                    amount,
                    oddsAtBet
                }
            })
    
            const updatedUser = await tx.user.update({
                where : {
                    id : userId
                },
                data : {
                    tokenBalance : user.tokenBalance - amount
                }
            })
    
            const updatedMarket = await tx.market.update({
                where : {
                    id : marketId
                },
                data : {
                    yesShares : choice ? market.yesShares + amount : market.yesShares,
                    noShares : choice ? market.noShares : market.noShares + amount,
                    totalVolume : market.totalVolume + amount
                }
            })

            return {createdBet, updatedUser, updatedMarket};
        })

        return { Bet : result.createdBet, User : result.updatedUser, Market : result.updatedMarket };
    } catch(err){
        console.log(`An error occured : ${err}`)
        throw new Error("Failed to place bet")
    }
}

const getUserBets = async (marketId : string, userId : string) => {
    try{

        const user = await prismaClient.user.findUnique({
            where : {
                id : userId
            }
        })
        if(!user){
            throw new Error("User not found")
        }

        const bet = await prismaClient.bet.findMany({
            where : {
                userId,
                marketId
            }
        })

        if(!bet){
            throw new Error("Bet not found")
        }

        return bet;
    } catch(err){
        console.log(`An error occured : ${err}`)
    }
}

const getMarketBets = async (marketId : string) => {
    try{
        const marketBets = await prismaClient.market.findMany({
            where : {
                marketId
            }
        })

        if(!marketBets){
            throw new Error("Market bets not found")
        }

        return marketBets;
    }
    catch(err){
        console.log(`An error occured : ${err}`)
    }
}

export { placeBet, getUserBets, getMarketBets };