import { Router } from "express";
import { assignAccessToken, getCurrentUser, getWatchHistory, loginUser, logoutUser, registerUser, subsciprtionDetails, updateAccountDetails, updateAvatarImage, updateCoverImage, updatePassword } from "../controllers/user.registercontrollers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";
import { allVideosDetails, deleteVideo, editVideo, videoUploader } from "../controllers/video.controller.js";

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

  router.route("/user/videoupload").post(
    verifyJWT,
    upload.fields(
      [
        {
          name:"videoFile",
          maxCount:1
        },
        {
          name:"thumbnail",
          maxCount:1
        }
      ]
    ),
    videoUploader
  )

  router.route("/user/getvideo").get(
    verifyJWT,
    allVideosDetails
  )
  
  router.route("/removevideo").delete(
    verifyJWT,
    deleteVideo
  )

  router.route("/update/:id").get(
    upload.single("thumbnail"),
    editVideo
  )
 

export default router;