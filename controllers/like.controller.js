import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";

//Do Like
export const doLike=asyncHandler(async function(req,res) {
    const userId=req.user?._id

    if(!userId){
        throw new ApiError(400,"User is not authenticated to Do the Task")
    }

    const {id,targetType}=req.body


    if(!id || !targetType){
        throw new ApiError(400,"Something went wrong please Do like Aagain")
    }
    

    const findDuplicate=await Like.findOne(
        {
         targetId: id,
         targetType: targetType,
         likedBy: userId
        } 
    )
    
    let message;

    if(findDuplicate){
       await Like.findOneAndDelete(
            {
              targetId: id,
              targetType: targetType,
              likedBy: userId
            }
        )
        return message="Unlike Done"
    }
    else{
        const like=await Like.create(
            {
              targetId: id,
              targetType: targetType,
              likedBy: userId
            }
        )
        return message="like Done"
    }

    return res
    .status(200)
    .json(new ApiResponse(
        "200",
        message
    ))

})

//Unlike Button
export const unLike=asyncHandler(async function(req,res) {
    const userId=req.user?._id

    if(!userId){
        throw new ApiError(401,"User is not authenticated to Do the Task")
    }

    const {id,targetType}=req.body
    
    if(!id || !targetType){
        throw new ApiError(400,"Something went wrong please Do like Aagain")
    }

    const response=await Like.findOneAndDelete(
            {
              targetId: id,
              targetType,
              likedBy: userId
            }
    )
   
    return res
    .status(200)
    .json(
        new ApiResponse(
            "200",
            "Unlike Done"
        )
    )


})

//Find All Like on Any Video or Tweet

export const findLike=asyncHandler(async function(req,res) {
    
})

