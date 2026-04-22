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

   if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

   if (!commentId) {
       throw new ApiError(400, "Comment ID is required");
    }

    const response=await Comment.findOneAndDelete(
        {
            _id:commentId,
            owner:userId
        }
    )

    if(!response){
        throw new ApiError(400,"Not authorized or comment not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Comment Deleted Successfully"
        )
    )
    
})

//Function for Fetch Comment on Pagination of limit 10
const findoutComment=asyncHandler(async function(req,res,targetType) {
    const {targetId}=req.params
    const {cursor}=req.query
    const {userId}=req.user
    //After ? we can send any query
    let Limit=10

    if(!mongoose.Types.ObjectId.isValid(targetId)){
        throw new ApiError(400,"Id is not matching to fetch Any comment")
    }

    let query={
        targetId,
        targetType
    }

    if(cursor){
        query._id={$lt:new mongoose.Types.ObjectId(cursor)}
        //less than id because new id > old id
    }

    const comments=await Comment.find(query)
    .sort({_id: -1 })
    //will sort greater first small last soo newest comment first oldest last
    .limit(Limit)

    if(!comments){
        throw new ApiError(400,"Comemnt not Found")
    }

    let commentEditable=comments.map((comment)=>{
       let obj=comment.toObject()
       obj.isEditable= userId && userId.toString()===obj.owner.toString()
       return obj
    })

    const nextCursor=comments.length>0?comments[comments.length-1]._id:null

    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            {
                comments:commentEditable,
                nextCursor
            },
            "Fetched Succesfully"
        )
    )

})

//Find Comment For Video with the help of upper fucntion
export const findCommentForVideo=asyncHandler(async function (req,res) {
    return findoutComment(req,res,"Video")
})

//Find Comment For Tweet with the help of upper fucntion
export const findCommentForTweet=asyncHandler(async function (req,res) {
    return findoutComment(req,res,"Tweet")
})