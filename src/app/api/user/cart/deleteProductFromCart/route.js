import axios from 'axios';
import cartModel from "@/model/cartModel";
import { NextResponse } from "next/server";
const jwt = require('jsonwebtoken');

export const POST = async (req) => {
    // Make db connection if needed (assuming dbConnect is imported and used here)
    // await dbConnect();

    const reqBody = await req.json();

    // Extract tokens from cookies
    const cookies = req.cookies;
    const accessToken = cookies.get('access-token')?.value;
    const refreshToken = cookies.get('refresh-token')?.value;

    if (!accessToken || !refreshToken) {
        return NextResponse.json({
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isProductDeletedFromCart: false,
        });
    }

    // Check if the user is logged in by calling the checkSession API
    const sessionResponse = await axios.post('http://localhost:3000/api/auth/checkSession', {}, {
        headers: {
            'access-token': accessToken,
            'refresh-token': refreshToken,
        },
    });

    const { isAuthenticated, newAccessToken,user } = sessionResponse.data;

    if (!isAuthenticated) {
        return NextResponse.json({
            newAccessToken: newAccessToken || null,
            message: 'Session timeout. Refresh token expired.',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isProductDeletedFromCart: false,
        });
    }

    const { productId } = reqBody;

    // as user is logged in, get userId from user which was response of checkSession
    const userId = user?.userProfileInfo?.userId;

     if (!productId || !userId ) {
        return NextResponse.json({
            newAccessToken: newAccessToken || null,
            message: 'Product ID or user ID missing in request.',
            isProductDeletedFromCart: false,
        });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return NextResponse.json({
            newAccessToken: newAccessToken || null,
            message: `Cart not found for user with id ${userId}.`,
            isProductDeletedFromCart: false,
        });
    }

    let existingProduct = cart?.allProductsInCart?.find(
        (product) => product._id.toString() === productId.toString()
    );

    if (!existingProduct) {
        return NextResponse.json({
            newAccessToken: newAccessToken || null,
            message: 'Product not found in cart.',
            isProductDeletedFromCart: false,
        });
    }

    await cartModel.updateOne(
        { user: userId },
        { $pull: { allProductsInCart: { _id: productId } } },
        { new: true }
    );

    // Return response and set new access token if generated
    const response = NextResponse.json({
        newAccessToken: newAccessToken || null,
        message: 'Product deleted from cart successfully.',
        isProductDeletedFromCart: true,
    });

    if (newAccessToken) {
        console.log('New access token sent over cookie');
        response.cookies.set('access-token', newAccessToken, { httpOnly: true });
    }

    return response;
};
