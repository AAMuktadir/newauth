import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { db } from "../db/db.js";
import cookieParser from "cookie-parser";

export const userRouter = express.Router();

userRouter.use(express.json)
userRouter.use(cookieParser(process.env.cookie_secret));


//test
userRouter.post("/test", (req,res)=>{
    res.json(req.body)
})

//signup
userRouter.post("/signup", async (req, res ) => {    
    try{
    const {username, name, password} = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await db.user.create({
        data: {
            userName : username,
            name : name,
            password : hashedPassword,
        },
    });
    console.log(user)
    res.status(200);
    res.json({name:"new user added successfully"});

 } catch (err){
        console.log(err);
        res.status(500).json({
            message : "Signup failed",
        });
    }
})

//login
userRouter.post("/login", async(req, res) => {
    try{
    const user = await db.user.findUnique({
        where : {
        userName : req.body.userName
        }
    });
    console.log("This is output");
    console.log(user.password);
    console.log("from input");
    console.log(req.body.password);
    if (user.id !=null){
        const isValidpass= await bcrypt.compare(req.body.password, user.password);
        
        if (isValidpass){
        //if (user.password==req.body.password){   
            const token = jwt.sign({
                userName : user.userName,
                id : user.id,
                name : user.name
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            res.cookie("access_token", token,{
                maxAge : 86400000,
                httpOnly : true,
                signed : true
            });

            res.status(200).json({
                "access_token": token,
                "message": "login successful"
            })
        }
        else {
            res.status(401).json({
                "error" : "authentication failed(not valid pass)"
            });   
        }
    }
    else {
        res.status(401).json({
            "error" : "authentication failed(user name)"
        });
    }
    }
    catch(error){
        console.log(error);
        res.status(401).json({
            "error" : "authentication failed"
        });
    }
})

userRouter.get("/", async (req, res) => {
    const users = await db.user.findMany();
    res.json({users})
});

userRouter.put("/edit", async (req, res) => {
    try{
    const update = await db.User.update({
        where: {
            id : req.body.id,
        },
        data: {
            name : req.body.name,
        },
    });
    res.json({msg:"Edited"})
    }
    catch(err) {
        console.log(err);
        res.json({"msg": "update failed"})
    }
});

userRouter.put("/active", async (req, res) => {
    try{
        const update = await db.User.update({
            where: {
                id : req.body.id,
            },
            data: {
                status : req.body.status,
            },
        });
        res.json({"msg":"Account activated"})
        }
        catch(err) {
            console.log(err);
            res.json({"msg": "could not active account"})
        }
})

userRouter.delete("/delete", async (req, res) => {
    try{
        const user = await db.user.delete({
            where : {
                userName : req.body.userName
            }

        })

        res.status(200).json({
            "message": "deleted successfully"
        })
    }
    catch{
        res.status(404).json({
            "message" : "could not find user"
        })
    }
})