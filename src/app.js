import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app=express()

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true //allow to acess Sessions,cookies,header
    }
))

app.use(express.json( {limit:"20kb"}))
//express to accept json
app.use(express.urlencoded({extended:true,limit:"20kb"}))
//extended-nested object
app.use(express.static("public"))
//public is a folder
app.use(cookieParser())


//routes
import userRouter from "../routes/user.routes.js"

//routers
app.use("/v1/api/user",userRouter)

export {app}