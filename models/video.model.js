import mongoose,{Schema} from "mongoose";

const videoSchema=new Schema({
    videoFile:{
        type:String,//cloudinary
        required:true
    },
    thumbnail:{
        type:String,//cloudinary
        required:true
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    titile:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }
},
{timestamps:true})

export const Video=mongoose.model("Video",videoSchema)