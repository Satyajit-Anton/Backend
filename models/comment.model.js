import mongoose,{Schema} from "mongoose";

const commentSchema=new Schema({
    comment:{
        type:String,
        required:true
    },
    commentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
},{timestamps:true})

export const Comment=mongoose.model("Comment",commentSchema)