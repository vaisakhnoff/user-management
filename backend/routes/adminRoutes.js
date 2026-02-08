 import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';


const router = express.Router();

router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { search } = req.query

    let filter = {}
    if (search) {
      const regex = new RegExp(search, 'i')
      filter = { $or: [{ name: regex }, { email: regex }] }
    }

    const users = await User.find(filter).select('-password')
    res.status(200).json(users)
  }
)

router.delete(
  '/users/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  }
)

router.put(
  '/users/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { name, role } = req.body

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Prevent an admin from changing their own role. Allow name updates, but ignore role change
    const requesterId = req.user?.userId?.toString()
    const targetId = req.params.id?.toString()

    user.name = name || user.name

    if (requesterId === targetId) {
      // ignore any role changes to self
      // keep existing role
      user.role = user.role
    } else {
      user.role = role || user.role
    }

    await user.save()

    const updatedUser = await User.findById(user._id).select('-password')
    res.status(200).json(updatedUser)
  }
)

export default router
