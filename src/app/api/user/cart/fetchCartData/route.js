

import dbConnect from '@/config/dbConnect';
import checkIfUserIsLoggedIn from '@/middleware/auth';
import cartModel from '@/model/cartModel';
import { NextResponse } from 'next/server';


export const POST = async (req)=> {
    
    // Make db connection
    await dbConnect();

    const reqBody = await req.json();

    const accessToken = req.headers.get('access-token');
    const refreshToken = req.headers.get('refresh-token');
 

    if (!accessToken || !refreshToken) {
        return NextResponse.json({
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isProductAddedToCart: false,
        });
    }

    const isLoggedIn = await checkIfUserIsLoggedIn(reqBody, accessToken, refreshToken);
    if (!isLoggedIn) {
        return NextResponse.json({
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isProductAddedToCart: false,
        });
    }

    
    const userId = reqBody?.userId;
    
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return NextResponse.json({
            cartData:cart? cart : null,
            message: 'Cart not found for user with id ' + userId,
            isCartDataFetched: false,
        });
    }

    
    return NextResponse.json({
        cartData:cart? cart : null,
        message: 'cart fetched successfully.',
        isCartDataFetched: true,
       
    });
}
