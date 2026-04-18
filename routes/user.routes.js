import { Router } from "express";
import { assignAccessToken, getCurrentUser, getWatchHistory, loginUser, logoutUser, registerUser, subsciprtionDetails, updateAccountDetails, updateAvatarImage, updateCoverImage, updatePassword } from "../controllers/user.registercontrollers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router=Router()

  router.route("/register").post(
    //injected middleware because files are two or more soo fields
    //it need array with all details of object
    
    upload.fields([
        {name:"avatar",
         maxCount:1
        },
        {name:"coverImage",
         maxCount:1 
        }
    ]),
    registerUser)

  router.route("/login").post(
    loginUser
  )

  router.route("/refresh-token").post(
    assignAccessToken
  )

  router.route("/logout").post(
    verifyJWT,
    logoutUser
  )

  router.route("/change-avatar").post(
    upload.single("avatar"),
    verifyJWT,
    updateAvatarImage
  )

  router.route("/update-account-details").post(
    verifyJWT,
    updateAccountDetails
  )

  router.route("/update-password").post(
    verifyJWT,
    updatePassword
  )

  router.route("/change-coverimage").post(
    upload.single("coverImage"),
    verifyJWT,
    updateCoverImage
  )

  router.route("/getuser").post(
    verifyJWT,
    getCurrentUser
  )

  router.route("/channel/:username").get(
    verifyJWT,
    subsciprtionDetails
  )
  
  router.route("/user/watch-history").get(
    verifyJWT,
    getWatchHistory
  )

 

export default router;