const express=require("express");
const { auth } = require("../Middleware/auth.middleware");
const { blogModel } = require("../Model/blog.model");
const {CommentModel}=require("../Model/comment.model")

const blogRouter=express.Router();
blogRouter.use(auth)

blogRouter.get("/",async (req,res)=>{
    try {
        const blog=await blogModel.find();
        if(blog){
            res.status(200).json({blog})
        }else{
            res.status(400).json({msg:"blogs not found"})
        }
    } catch (error) {
        res.status(400).json({error:error})
    }
})

blogRouter.post("/",async(req,res)=>{
    try {
        console.log(req.userId,req.email);
        let {title,content,category,date,likes,comment}=req.body
        let newblog=await blogModel(req.body)
        // ({
        // //     title,content,category,date,username,creator,likes:[],comments:[]
        // // })
        await newblog.save();
        res.status(200).send({msg:"new blog added",blog:newblog})
    } catch (error) {
        res.status(400).send({error:error})
    }
})
blogRouter.patch("/:id",async(req,res)=>{
   try {
    const userId=req.userId;
    const payload=req.body;
    const {id}=req.params;
    const blog=await blogRouter.findById(id)
    const blogcreaterid=blog.creator.toString();

    if(blogcreaterid!==userId){
        res.status(400).send({
            msg:"not authorized for updating blog"
        })
        return;
    }
    const updateblog=await blogModel.findByidAndUpdate(id,payload,{
        new:true
    });
    res.status(200).send({
        msg:"blog updated sucessfully",
        updateblog
    })
   } catch (error) {
    res.status(400).send({error:error})
   }
})
blogRouter.delete("/:id",async(req,res)=>{
    try {
     const userId=req.body.userID;
     
     const blogid=req.params.id;
     const blog=await blogModel.find({_id:blogid});
     const useridinblog=blog.userID
     //const blogcreaterid=blog.creator.toString();
 if(userId==useridinblog){
    await blogModel.findByIdAndDelete({_id:blogid})
    res.status(200).send({
        msg:"blog deleted sucessfully"
    })
 }else{
    res.status(400).json({msg:"please auth"})
 }
     
    // const updateblog=await blogModel.findByIdAndDelete(id);
    
    } catch (error) {
     res.status(400).send({error:error})
    }
 })
 blogRouter.post("/:id/like",async(req,res)=>{
    try {
        const blogid=req.params.id;
        const blogfind=await blogModel.findById(blogid);
        if(!blogfind){
            return res.status(404).json({error:"blog not found"})
        }
        const userid=req.userId;
        const userindex=blogfind.likes.indexOf(userid);
        if(blogfind.likes.include(userid)){
            blogfind.likes.splice(userindex,1)
            await blogfind.save();
            return res.status(200).json({
                error:"already liked"
            })
        }
        blogfind.likes.push(userid)
        await blogfind.save();
        res.status(200).json({
            msg:"blog like sucessful"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"something wrong"})
    }
 })
 blogRouter.post("/:id/comments",async(req,res)=>{
    try {
        const postid=req.params.id;
        const comment_text=req.body.comment_text;
        const userId=req.userId;
        const post=await blogModel.findById(postid);
        if(!post){
            return res.status(404).json({error:"post not found"})
        }
        const commenteddata={
            comment_text:comment_text,
            comment_creator:userId,
            createdby:req.body.createdby
        }
    
    const newcomment=await CommentModel.create(commenteddata);
    post.comments.push(newcomment);
    await post.save();
    res.status(201).json({
        msg:"comment sucess",newcomment
    })
    } catch (error) {
        res.status(500).json({
            error:"something went wrong"
        })
    }
 })

module.exports={
    blogRouter
}