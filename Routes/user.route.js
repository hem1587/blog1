const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const { userModel } = require("../Model/user.model");
require("dotenv").config()
const userRouter=express.Router();

userRouter.post("/register",async(req,res)=>{
    try {
        const {email,username,password,avtar}=req.body;
        const existinguser=await userModel.findOne({email});
        if(existinguser){
            res.status(400).json({msg:"user already exists"})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    res.status(400).json({err:err})
                }else{
                    const user=new userModel({email,password:hash,avtar,username});
                    await user.save();
                    res.status(200).json({msg:"user registered sucessfully",user:req.body})
                }
            })
        }
    } catch (error) {
        res.status(400).json({error:error})
    }
})
userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            res.status(400).json({msg:"user not exists"})
        }else{
            bcrypt.compare(password,user.password,(err,decode)=>{
                if(decode){
                    const token=jwt.sign({userId:user._id,username:user.username},process.env.secretKey);
                    res.status(200).json({msg:"logged in",token})
                }else{
                    res.status(400).json({error:err})
                }
            })
        }
    } catch (error) {
        res.status(400).json({error:err})
    }
})
module.exports={
    userRouter
}