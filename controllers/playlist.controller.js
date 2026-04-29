import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {PlayList} from "../models/playlist.model.js"
import mongoose from "mongoose";

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

export const addnewItemtoPlayList=asyncHandler(async function(req,res){
    const userId=req.user?._id
    const {playlistName,videoId}=req.body

    if(!userId){
        throw new ApiError(400,"User is not Authenticated to Do that")
    }

    if(!playlistName || !videoId){
        throw new ApiError(400,"VideoId and PlayListName Must need to add Video in the perticualr playlist")
    }

    const added=await PlayList.findOneAndUpdate(
        {
            name:playlistName,
            owner:userId
        },
        {
            $addToSet:{videos:videoId}
        },
        {
            returnDocument:"after"
        }

    )

    if(!added){
        throw new ApiError(500,"Some issue when Adding to Playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            added,
            "Video Added to Existing Playlist"
        )
    )


})

export const removeItemFromPlaylist=asyncHandler(async function(req,res) {
    const userId=req.user?._id
    const { playlistId, videoId } = req.body;

    if(!userId){
        throw new ApiError(400,"User is not authenticated")
    }

    if(!playlistId || !videoId){
        throw new ApiError(400,"Playlist Is not given")
    }

    const result=await PlayList.findOneAndUpdate(
       {
        _id:playlistId,
        owner:userId,
        videos:videoId
       },
       {
        $pull:{videos:videoId}
       },
       {
        returnDocument:"after"
       }
    )

    if(!result){
        throw new ApiError(400,"Video is not removed from playlist or not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "Playlist Updated Successfully"
        )
    )


})

export const removePlaylist=asyncHandler(async function(req,res) {
    const userId=req.user?._id
    const {playlistId}=req.params

    if(!userId){
        throw new ApiError(400,"user is not authenticated")
    }

    if(!playlistId){
        throw new ApiError(400,"Playlist Id not avail for Delete")
    }

    const result=await PlayList.findOneAndDelete(
        {
            _id:playlistId,
            owner:userId
        }
    )

    if(!result){
        throw new ApiError(500,"Deletion Failed Due to unexpected issue")
    }

    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            "PlayList Delete Successfully"
        )
    )
})


export const findPlayList=asyncHandler(async function (req,res) {
    const userId=req.user?._id

    if(!userId){
        throw new ApiError(400,"User is not Authorized to Give request")
    }

    const result=await PlayList.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        }
    ])

    if(result.length === 0){
        throw new ApiError(400,"No Playlist Found or User is not found or unauthorized access")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "PLaylist fteched Sucessfully"
        )
    )
})
