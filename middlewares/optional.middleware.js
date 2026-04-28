import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken";

export const optionalVerfiyJwt=asyncHandler(async function(req,_,next) {
    try {
        const authToken=req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!authToken){
            req.user=null
            return next()
        }
    
        const decodedToken=jwt.verify(authToken,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        req.user=user ||null
        next()
    } catch (error) {
        req.user = null;
        next();
    }


})