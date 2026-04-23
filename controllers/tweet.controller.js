import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Tweet} from "../models/tweet.model.js"

export const createTweet=asyncHandler(async function(req,res) {
    const userId=req.user?._id
    const {content}=req.body

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    if (!content || content.trim() === "") {
       throw new ApiError(400, "Content is required");
    }

    const response=await Tweet.create({
        content:content.trim(),
        userId
    })

    if(!response){
        throw new ApiError(500,"Tweet is not Created please try again")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        response,
        "tweet created succesfully"
    ))

})

export const editTweet=asyncHandler(async function(req,res) {
    const userId=req.user?._id
    const {content}=req.body
    const {id:tweetId}=req.params

    if(!userId){
        throw new ApiError(400,"user is not authenticated Do the edit")
    }

    if (!content || content.trim() === "") {
       throw new ApiError(400, "Content is required");
    }

    const tweet=await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(400,"tweet Is not Found")
    }

    if(tweet.tweetBy.toString() !==userId.toString()){
        throw new ApiError(400,"You are not Authorized to edit this tweet")
    }

    
    tweet.content=content.trim()
    const updatedTweet=await tweet.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            updatedTweet,
            "Tweet updated Succesfully"
        )
    )


})