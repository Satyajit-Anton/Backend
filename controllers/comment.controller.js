import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

//DO Comment On Video And Tweet
const doComment=asyncHandler(async function(req,res) {
    const userId=req.user?._id
    if (!userId) {
        throw new ApiError(401,"User is not authenticated")
    }

    const {comment,targetId,targetType}=req.body

    if(!comment || !targetId || !targetType){
        throw new ApiError(400,"user must need to Provide ALL Stuff to get comment")
    }

    if(!mongoose.Types.ObjectId.isValid(targetId)){
        throw new ApiError(400,"Please pass a Valida targetId")
    }

    const response=await Comment.create(
        {
            comment,
            commentBy:userId,
            targetId,
            targetType
        }
    )

    if(!response){
        throw new ApiError(500,"Somethig went wrong during posting the comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            "200",
            response,
            "Comment Done"
        )
    )

})

//Update Comment
const updateComment=asyncHandler(async function(req,res) {
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401,"User is not authenticated")
    }
    const {id,comment}=req.body

    if(!id || !comment){
        throw new ApiError(400,"User is not Authenticated to Do that")
    }
    
    const existingComment=await Comment.findById(id)
    
    if(!existingComment){
        throw new ApiError(400,"Comment not Found to Edit")
    }

    if(existingComment.commentBy.toString()!==userId.toString()){
        throw new ApiError(400,"You are not authenticated to do the Update")
    }


    const response=await Comment.findByIdAndUpdate(
        id,
        {
            comment
        },
        { new: true, runValidators: true }
    )

    if(!response){
        throw new ApiError(500,"Something went wrong during update the comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "Comment Updated Succesfully"
        )
    )
})

//Delete Comment
const deleteComment=asyncHandler(async function (req,res) {
    const userId=req.user?._id

    const{commentId}=req.body
})