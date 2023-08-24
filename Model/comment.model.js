const mongoose=require("mongoose");
const commentSchema=new mongoose.Schema(
    {
       comment_text:String,
       comment_creator:String,
       createdby:String
    },{
        versionKey:false
    }
);
const CommentModel=mongoose.model("comment",commentSchema);
module.export={
    CommentModel
}