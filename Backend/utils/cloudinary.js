import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudiNary=async function (localFilepath){
    
    try {
        if(!localFilepath) return null
        const response=await cloudinary.uploader.upload(localFilepath,{
            resource_type:"auto"
        })
        console.log("Uploaded the File and Response is",response)
        return response
    } catch (error) {
        console.log("Error at File Uploading in Cloudinary",error);
        return null
    }finally{
        if(localFilepath){
           await fs.promises.unlink(localFilepath)
           console.log("Deletion Is executed");
           //unlink is non-blocking
           //unlinkSync is blocking
        }
    }
}

export  {uploadOnCloudiNary};