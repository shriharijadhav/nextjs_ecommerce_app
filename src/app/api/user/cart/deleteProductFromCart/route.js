// import checkIfUserIsLoggedIn from '../../../middleware/auth';
// const dbConnect = require('../../../config/dbConnect');
// const cartModel = require('../../../model/cartModel');

import checkIfUserIsLoggedIn from "@/middleware/auth";
import cartModel from "@/model/cartModel";
import { NextResponse } from "next/server";

export const POST = async (req)=> {
 
    const reqBody = await req.json();

    const accessToken = req.headers.get('access-token');
    const refreshToken = req.headers.get('refresh-token');

    const isLoggedIn = await checkIfUserIsLoggedIn(reqBody, accessToken, refreshToken);
    if (!isLoggedIn) {
        return NextResponse.json({
            newAccessToken: req.newAccessToken ? req.newAccessToken : null,
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isProductDeletedFromCart: false,
        });
    }

    if (!accessToken || !refreshToken) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isProductDeletedFromCart: false,
        });
    }

    

    const { productId } = reqBody ;
    const userId = reqBody?.userId;

    if (!productId || !userId) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Product ID or user ID missing in request.',
            isProductDeletedFromCart: false,
        });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Cart not found for user.',
            isProductDeletedFromCart: false,
        });
    }

    let existingProduct = cart?.allProductsInCart?.find(
        (product) => product._id.toString() === productId.toString()
    );

    if (!existingProduct) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Product not found in cart.',
            isProductDeletedFromCart: false,
        });
    }

    const updatedCart = await cartModel.updateOne(
        { user: userId },
        { $pull: { allProductsInCart: { _id: productId } } },
        { new: true }
    );

    return NextResponse.json({
        newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
        message: 'Product deleted from cart successfully.',
        isProductDeletedFromCart: true,
    });
}
