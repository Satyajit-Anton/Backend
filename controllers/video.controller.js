import { Video } from "../models/video.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";


const videoController=asyncHandler(async function(req,res) {
    const videoFile=req.files?.videoFile?.[0].path
    const thumbnail=req.files?.thumbnail?.[0].path
    const {titile,description}=req.body

    const id=req.user?._id
    
    if(!id){
        throw new ApiError(400,"user is not authenticated to upload video")
    }

    const videoUploadResponse=await Video.create({
        videoFile,
        thumbnail,
        id,
        titile,
        description,
    })


})