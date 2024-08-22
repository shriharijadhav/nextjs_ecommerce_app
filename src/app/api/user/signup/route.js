import dbConnect from "@/config/dbConnect";
import cartModel from "@/model/cartModel";
import userModel from "@/model/userModel";
import { NextResponse } from "next/server";

const bcrypt = require('bcrypt');


export const  POST = async (req)=> {
    
    await dbConnect();
   
    try{

        const {firstName,lastName,email,password,contact} = await req.json();

        // is null check
        if(!firstName || !lastName || !email || !password || !contact) {
            return NextResponse.json({
                message:'Some of field are missing. please check',
                isSignupSuccess:false
            })
        }

        // check if the user is already registered
        const userFromDB = await userModel.findOne({email:email})
        if(userFromDB){
            return NextResponse.json({
                message:'User already registered. please login',
                isUserAlreadyRegistered:true,
                isSignupSuccess:false
            })
        }

        // hash the password before inserting data into the database
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const savedUser = await userModel.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashedPassword,
            contact:contact     
        })

        const cartCreated = await cartModel.create({user:savedUser._id})

        if(!savedUser || ! cartCreated){
            return NextResponse.json({
                message:'Failed to register user. please try again',
                isSignupSuccess:false,
            })
        }

        return NextResponse.json({
            message:'User registered successfully',
            isSignupSuccess:true,
        })
       


    } catch (error) {
        return NextResponse.json({
            error: 'Failed to sign up user. Please try again',
            isSignupSuccess:false,
        });
    }
}