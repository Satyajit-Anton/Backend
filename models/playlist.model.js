import mongoose,{mongo, Schema} from "mongoose";

const playListSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    videos:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const PlayList=mongoose.model("PlayList",playListSchema)

