const mongoose=require("mongoose");
const likeSchema=new mongoose.Schema(
    {
        liker:{
            type:mongoose.Schema.Types.ObjectId,
           ref:"userModel"
        }
    },{
        versionKey:false
    }
);
const likeModel=mongoose.model("blogwoek_like",likeSchema);
module.export={
    likeModel
}