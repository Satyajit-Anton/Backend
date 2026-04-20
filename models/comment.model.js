import mongoose,{mongo, MongooseError, Schema} from "mongoose";

const commentSchema=new Schema({
    comment:{
        type:String,
        required:true
    },
    commentBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    video:{
        type:mongoose.Schema.ObjectId,
        ref:"Video"
    }
},{timestamps:true})

export const Comment=mongoose.model("Comment",commentSchema)