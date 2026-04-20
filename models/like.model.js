import mongoose,{Schema} from "mongoose";

const likeSchema=new Schema({
    video:{
        type:mongoose.Schema.ObjectId,
        ref:"Video"
    },
    tweet:{
        type:mongoose.Schema.ObjectId,
        ref:"Tweet"
    },
    comment:{
        type:mongoose.Schema.ObjectId,
        ref:"Comment"
    },
    likedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},
{timestamps:true})

export const Like=mongoose.model("Like",likeSchema)