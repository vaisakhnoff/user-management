import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'uploads/')
    },
    filename :(req,file,cb)=>{
        cb(
            null,
         `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
        )
    }
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/
  const ext = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)

  if (ext && mime) cb(null, true)
  else cb(new Error('Images only'))
}

export const upload = multer({
  storage,
  fileFilter,
})