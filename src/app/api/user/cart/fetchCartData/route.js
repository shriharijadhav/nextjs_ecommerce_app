import axios from 'axios';
import dbConnect from '@/config/dbConnect';
import cartModel from '@/model/cartModel';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    // Make DB connection
    await dbConnect();

    // Extract tokens from cookies
    const cookies = req.cookies;
    const accessToken = cookies.get('access-token')?.value;
    const refreshToken = cookies.get('refresh-token')?.value;

    if (!accessToken || !refreshToken) {
        return NextResponse.json({
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isCartDataFetched: false,
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
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isCartDataFetched: false,
        });
    }

    // Extract userId from the session data
    const userId = user?.userProfileInfo?.userId;

    // Fetch cart data for the user
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return NextResponse.json({
            cartData: null,
            message: `Cart not found for user with id ${userId}`,
            isCartDataFetched: false,
        });
    }

    // Return response with cart data and set a new access token if generated
    const response = NextResponse.json({
        cartData: cart,
        message: 'Cart fetched successfully.',
        isCartDataFetched: true,
    });

    if (newAccessToken) {
        console.log('New access token sent over cookie');
        response.cookies.set('access-token', newAccessToken, { httpOnly: true });
    }

    return response;
};
