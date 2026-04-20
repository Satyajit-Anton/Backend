import mongoose,{Schema} from "mongoose";

const commentSchema=new Schema({
    comment:{
        type:String,
        required:true
    },
    commentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    targetId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"targetType",
        required:true
    },
    targetType:{
        type:String,
        required:true,
        enum:["Video","Tweet"]
    }
},{timestamps:true})

export const Comment=mongoose.model("Comment",commentSchema)