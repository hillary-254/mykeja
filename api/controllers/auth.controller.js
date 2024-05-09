import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

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

    }catch(error){}
}

const logout = async(req, res) => {}

export { register, login, logout }