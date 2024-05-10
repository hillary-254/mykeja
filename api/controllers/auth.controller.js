import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

const register = async(req, res) => {
    try{
        const { username, email, password } = req.body;

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
   
        //save to db using prisma
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: 'User created successfully', data: newUser });
    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const login = async(req, res) => {
    try{
        const { username, password } = req.body;

        //check if user exists
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if(!user){
            res.status(401).json({ message: 'Invalid credentials!' });
        }

        //check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            res.status(401).json({ message: 'Invalid credentials!' });
        }

        //generate cookie token & send to user
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 0.5 //0.5 hours
        }).json({ message: 'Login successful' })

    }catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const logout = async(req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
}

export { register, login, logout }