const mongoose=require("mongoose");

const blogSchema=mongoose.Schema({
    username:String,
    title:String,
    content:String,
    category:String,
    date:String,
    // creator:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"userModel"
    // },
    likes:Number,
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }]

},{
    versionKey:false
})

const blogModel=mongoose.model("blogs",blogSchema)

module.exports={
    blogModel
}
