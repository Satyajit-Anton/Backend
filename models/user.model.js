import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose,{Schema} from "mongoose";

const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudinary image Url will be the string value
        required:true
    },
    coverImage:{
        type:String,//cloudinary image Url will be the string value
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    watchHistory:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"video"
        }
    ],
    refreshToken:{
        type:String
    }

},
{timestamps:true})

UserSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10) //->this line update the password to hash before save to Db 
    //When you call save(), the pre("save") hook runs first, and it converts (hashes) 
    // the password before the data is written to the database.
    //here function will work not the arrow function because it doesn't have this access
    //which need to has,round=how many times
    //you are just saying hey i just done my work and do next process basiclly save things
})





//Custom Methods
UserSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
    //return true/false
}

//generate AccessToken everytime when access needed
UserSchema.methods.generateAcessToken= function(){
   return jwt.sign(
      {
       _id:this._id,
       fullName:this.fullName,
       email:this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}

//generate refreshToken
//Stays Long period of time

UserSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
      {
       _id:this._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
      }
   )
}


export const User=mongoose.model("User",UserSchema)
