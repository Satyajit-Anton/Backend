import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
    //here destination is set bya function which holds the user req,file and cb=callback
    //when it execute that menas there is no error and we have to passed where the destination should be set
    //null=no errror
    //if (new Error(error),null)=>then firts error means nothing wrong processed but second one is data
    //but in second it's null means there nothing data 
    //lastly first there is no null menas something went wrong stop fruther execution
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage
})