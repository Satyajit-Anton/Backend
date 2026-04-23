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
const findLike=asyncHandler(async function(req,res,targetType) {
    const {id: targetId}=req.params
    const userId=req.user?._id


    let Liked;
    if(userId){
        Liked=await Like.aggregate([
            {
              $match:{
                targetId,
                targetType,
              }   
            },
            {
                $group:{
                    _id:null,
                    //means all match document comes to this group
                    totalLikes:{$sum:1},
                    likedByuser:{
                        $sum:{
                            $cond:[
                             {$eq:["$likedBy", new mongoose.Types.ObjectId(userId)]},
                              1,
                              0
                            ]
                        }
                    }

                }
            }
        ])
    }else{
        Liked=await Like.aggregate([
            {
              $match:{
                targetId,
                targetType,
              }   
            },
            {
               $count: "totalLikes"
            }
        ])

    }
    
    const totalLikes=Liked[0]?.totalLikes || 0
    const likedByUser=Liked[0]?.likedByuser || 0

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
               totalLikes,
               likedByUser
            },
            "fteched successfully"

        )
    )


})

export const getLikeForVideo=asyncHandler(async function(req,res) {
    return findLike(req,res,"Video")
})

export const getLikeForTweet=asyncHandler(async function(req,res) {
    return findLike(req,res,"Tweet")
})

export const getLikeForComment=asyncHandler(async function(req,res) {
    return findLike(req,res,"Comment")
})
