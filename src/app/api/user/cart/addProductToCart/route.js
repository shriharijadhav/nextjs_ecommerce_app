

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

     // Get cookies from the request
    //  const accessToken = req.cookies.get('access-token')?.value;
    //  const refreshToken = req.cookies.get('refresh-token')?.value;

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

    // Logic for adding product to cart starts here
    const { productFromRequest } = reqBody;
    const userId = reqBody?.userId;
    const cartId = reqBody?.completeUserDetails?.userCart?._id;

    if (!productFromRequest || !userId || !cartId) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Either productFromRequest, user id or cart is missing in request.',
            isProductAddedToCart: false,
            cartId,
            productFromRequest,
            userId
        });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Cart not found for user with id ' + userId,
            isProductAddedToCart: false,
        });
    }

    // Check if the product already exists in the cart
    let existingProduct = cart?.allProductsInCart?.find(
        (product) => product._id.toString() === productFromRequest._id.toString()
    );
    
    let updatedCart;
    if (!existingProduct) {  // Changed condition to check if existingProduct is undefined
        // Case 1: Product is added to cart for the first time
        let newProduct = {
            ...productFromRequest,
            quantity: 1,
        };
        updatedCart = await cartModel.updateOne(
            { user: userId },
            { $push: { allProductsInCart: newProduct } },
            { new: true }
        );
    } else {
        // Case 2: Product already exists in the cart, increase quantity by 1
        updatedCart = await cartModel.updateOne(
            { user: userId, 'allProductsInCart._id': existingProduct._id },
            { $inc: { 'allProductsInCart.$.quantity': 1 } },
            { new: true }
        );
    }
    
    return NextResponse.json({
        newAccessToken: req.newAccessToken ? req.newAccessToken : null,
        message: 'Product added to cart successfully.',
        isProductAddedToCart: true,
       
    });
}
