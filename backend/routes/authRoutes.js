import express from 'express'
import { login, register } from '../controllers/authControllers.js'
import authMiddleware from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import User from '../models/User.js'




const router =express.Router();

router.get('/me', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
  res.set('Cache-Control', 'no-store')
  res.status(200).json(user)
})


router.post('/register',register)
router.post('/login',login)

router.put(
  '/profile',
  authMiddleware,
  upload.single('profileImage'),
  async (req, res) => {

    console.log('BODY:', req.body)
    console.log('FILE:', req.file)

  const user = await User.findById(req.user._id)


   if (req.body.name) {
      user.name = req.body.name
    }

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`
    }

    await user.save()

  const updatedUser = await User.findById(user._id).select('-password')


     res.set('Cache-Control', 'no-store')
    res.status(200).json(updatedUser)
    
  }
)

export default router