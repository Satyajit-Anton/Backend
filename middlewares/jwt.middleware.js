import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken";


export const verifyJWT=asyncHandler(async function (req,_,next) {
    // why "_" beacuse there is no use of response in middleware or anywhere
    try {
        const token=req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
        //in mobile application it will send a Bearer Authorization token and reoplace method user to replace "Bearer " to ""-rest will be token
        
        if (!token) {
            throw new ApiError(400,"User is Not authenticated")
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if(!user){
            throw new ApiError(401,"User is not found")
        }
    
        req.user=user
    
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})
