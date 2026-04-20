import mongoose,{Schema} from "mongoose";

const likeSchema=new Schema({
    targetId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "targetType"
    },
    targetType:{
        type:String,
        required:true,
        enum: ["Video", "Tweet", "Comment"]
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
{timestamps:true})

export const Like=mongoose.model("Like",likeSchema)