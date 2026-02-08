import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async (req,res) =>{

    const {name,email,password} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        name,
        email,
        password : hashedPassword,
    })

    res.status(201).json({message:"User registered successfully"})
}

export const login = async(req,res) =>{
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(401).json({message : "User not found"});
    };

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        res.status(401).json({message : "Invalid Password"});
    };

    const token = jwt.sign(
        {    userId : user._id, role : user.role } ,
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    )

    res.json({
        token,
        user:{
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage || null,

        },
    })
}