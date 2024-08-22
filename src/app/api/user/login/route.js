import dbConnect from "@/config/dbConnect";
import addressModel from "@/model/addressModel";
import cartModel from "@/model/cartModel";
import placedOrderModel from "@/model/placedOrderModel";
import userModel from "@/model/userModel";
import { NextResponse } from "next/server";


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


export const POST = async (req) => {
 
    await dbConnect();

    try {
        const {email,password} = await req.json();

        //  is null or empty string check
        if(!email || !password) {
            return NextResponse.json({
                message:'Some of field are missing. please check',
                isSignupSuccess:false,
                email,password
            })
        }

        //  check if user is registered or not 
        const userFromDB = await userModel.findOne({email:email})
        if(!userFromDB){
            return NextResponse.json({
                message:'User is not registered. Please register first',
                isUserAlreadyRegistered:false,
                isLoginSuccessful:false
            })
        }

        //  check if password from request matches the hashed password in database
        if (!bcrypt.compareSync(password, userFromDB.password)) {
            return NextResponse.json({
                message:'Password is not matching',
                isPasswordNotMatching:true,
                isLoginSuccessful:false
            })
        }

        
        const payload ={
           userId:userFromDB._id
        }

        const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });


        //  fetch all the data of user from multiple collections and send in response
        const userAddresses = await addressModel.find({ user: userFromDB._id})
        const userCart = await cartModel.findOne({ user: userFromDB._id})
        const ordersPlaced = await placedOrderModel.find({ user: userFromDB._id})
        const userProfileInfo = {firstName:userFromDB.firstName, lastName:userFromDB.lastName,email:userFromDB.email,contact:userFromDB.contact,userId:userFromDB._id}
        
        const userData = {
            userProfileInfo,
            userAddresses,
            userCart,
            ordersPlaced
        }

        const response = NextResponse.json({
            message:'login successful',
            isLoginSuccessful:true,
            // email,password
            userData,
        })

       

        response.cookies.set('access-token', accessToken,{ httpOnly: true,})
        response.cookies.set('refresh-token', refreshToken,{ httpOnly: true,})


        return response
     
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to login '+error.message,
        });
    }
}