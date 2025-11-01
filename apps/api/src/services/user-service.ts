import bcrypt from "bcrypt"
import prismaClient from "@foresight/db"

const createUser = async (email : string, username : string, password : string) => {
    try {
        if(email || username || password){
            throw new Error("Credentials doesn't exist");
        }
        const existingUser = await prismaClient.user.findFirst({
            where : {
                AND : [{ email : email }, { username : username }]
            }
        })
        if(existingUser){
            throw new Error("User already exists with this email or username")
        }
        const hashedPassword = await bcrypt.hashSync(password, 5)
        const user = await prismaClient.user.create({
            data : {
                email,
                username,
                password : hashedPassword
            }
        })
        return user
    } catch (err) {
        console.log(`An error occured : ${err}`)
        return;
    }
}

const getUser = async (email : string, password : string) => {
    try {
        if(!email || !password){
            throw new Error("Credentials doesn't exist");
        }
        const user = await prismaClient.user.findUnique({
            where : {
                email : email
            }
        })
        if(!user){
            throw new Error("User not found");
        }
        const match = await bcrypt.compareSync(password, user.password);
        if(!match){
            throw new Error("Invalid password");
        }
        return user;
    } catch (err) {
        console.log(`An error occured : ${err}`)
        return;
    }
}

const getTokenBalance = async (username : string) => {
    try {
        if(!username){
            throw new Error("Username doesn't exist");
        }
        const user = await prismaClient.user.findUnique({
            where : {
                username : username
            }
        })
        if(!user){
            throw new Error("User not found");
        }
        return user.tokenBalance;
    } catch (err) {
        console.log(`An error occured : ${err}`);
        return;
    }
}

enum Role {
    user = "user",
    admin = "admin"
}

const changeRole = async (username : string, role : Role) => {
    try {
        if(!username || !role){
            throw new Error("Username or role doesn't exist");
        }
        const user = await prismaClient.user.update({
            where : {
                username : username
            },
            data : {
                role : role
            }
        })
        if(!user){
            throw new Error("User not found");
        }
        return user;
    } catch (err) {
        console.log(`An error occured : ${err}`)
        return;
    }
}

const updateTokenBalance = async (id : string, amount : number) => {
    try {
        if(!id || !amount){
            throw new Error("User ID or amount doesn't exist");
        }
        await prismaClient.user.update({
            where : {
                id : id
            },
            data : {
                tokenBalance : amount
            }
        })
        return true;
    } catch (err) {
        console.log(`An error occured : ${err}`)
        return;
    }
}


const getUserById = async (id : string | undefined) => {
    try {
        if(!id){
            throw new Error("User ID doesn't exist");
        }
        const user = await prismaClient.user.findUnique({
            where : {
                id : id
            }
        })
        if(!user){
            throw new Error("User not found");
        }
        return user;
    } catch (err) {
        console.log(`An error occured : ${err}`)
        return;
    }   
}

export { createUser, getUser, getUserById, getTokenBalance, updateTokenBalance, changeRole }