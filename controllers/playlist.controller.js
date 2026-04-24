import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {PlayList} from "../models/playlist.model.js"

export const createPlayList=asyncHandler(async function(req,res) {
    const userId=req.user?._id
    const {name,videoId}=req.body

    if(!userId){
        throw new ApiError(400,"User Must Logged In to add any Any Playlist")
    }

    if(!name || !name.trim() || !videoId ){
        throw new ApiError(400,"Must Provide a Valid name and Video details to Add into Playlist ")
    }

    const existingCheck=await PlayList.findOne(
        {
            name:name.trim(),
            owner:userId
        }
    )

    if(existingCheck){
        throw new ApiError(400,"Existing Playlist is laready There with the same Name")
    }

    const playList=await PlayList.create(
        {
            name:name.trim(),
            owner:userId,
            videos:videoId
        }
    )

    if(!playList){
        throw new ApiError(500,"Some issue while creating Playlist Please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            playList,
            "Playlist Created Successfully"
        )
    )
})