import axios from 'axios';
import cartModel from '@/model/cartModel';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const reqBody = await req.json();

     // Extract tokens from cookies
     const cookies = req.cookies;
     const accessToken = cookies.get('access-token')?.value;
     const refreshToken = cookies.get('refresh-token')?.value;

    if (!accessToken || !refreshToken) {
        return NextResponse.json({
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isProductQuantityIncreased: false,
        });
    }

    // Check if the user is logged in by calling the checkSession API
    const sessionResponse = await axios.post('http://localhost:3000/api/auth/checkSession', {}, {
        headers: {
            'access-token': accessToken,
            'refresh-token': refreshToken,
        },
    });

    const { isAuthenticated, newAccessToken, user } = sessionResponse.data;

    if (!isAuthenticated) {
        return NextResponse.json({
            
            message: 'Session timeout. Refresh token expired.',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isProductQuantityIncreased: false,
        });

    }

    const { productId } = reqBody;
    const userId = user?.userProfileInfo?.userId;

    if (!productId || !userId) {
        return NextResponse.json({
            
            message: 'Product ID or user ID missing in request.',
            isProductQuantityIncreased: false,
        });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return NextResponse.json({
            
            message: `Cart not found for user with id ${userId}.`,
            isProductQuantityIncreased: false,
        });
    }

    let existingProduct = cart?.allProductsInCart?.find(
        (product) => product._id.toString() === productId.toString()
    );

    if (!existingProduct) {
        return NextResponse.json({
            
            message: 'Product not found in cart.',
            isProductQuantityIncreased: false,
        });
    }

    // Increase product quantity
    await cartModel.updateOne(
        { user: userId, 'allProductsInCart._id': existingProduct._id },
        { $inc: { 'allProductsInCart.$.quantity': 1 } },
        { new: true }
    );

    // Return response and set new access token if generated
    const response = NextResponse.json({
        
        message: 'Product quantity increased successfully.',
        isProductQuantityIncreased: true,
    });

    if (newAccessToken) {
        console.log('New access token sent over cookie');
        response.cookies.set('access-token', newAccessToken, { httpOnly: true });
    }

    return response;
};
