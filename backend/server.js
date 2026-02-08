import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import path from 'path'


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes);

app.use('/uploads',express.static(path.join(process.cwd(),'uploads')))
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))