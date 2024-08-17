import checkIfUserIsLoggedIn from '@/middleware/auth';
import cartModel from '@/model/cartModel';
import { NextResponse } from 'next/server';


export const POST = async (req)=> {
    
    const reqBody = await req.json();

    const accessToken = req.headers.get('access-token');
    const refreshToken = req.headers.get('refresh-token');

    if (!accessToken || !refreshToken) {
        return NextResponse.json({
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isProductQuantityIncreased: false,
        });
    }

    const isLoggedIn = await checkIfUserIsLoggedIn(reqBody, accessToken, refreshToken);
    if (!isLoggedIn) {
        return NextResponse.json({
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isProductQuantityIncreased: false,
        });
    }

    const { productId } = reqBody;
    const userId = reqBody?.userId;

    if (!productId || !userId) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Product details or user ID missing in request.',
            isProductQuantityIncreased: false,
        });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Cart not found for user.',
            isProductQuantityIncreased: false,
        });
    }

    let existingProduct = cart?.allProductsInCart?.find(
        (product) => product._id.toString() === productId.toString()
    );

    if (!existingProduct) {
        return NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Product not found in cart.',
            isProductQuantityIncreased: false,
        });
    }

    const updatedCart = await cartModel.updateOne(
        { user: userId, 'allProductsInCart._id': existingProduct._id },
        { $inc: { 'allProductsInCart.$.quantity': 1 } },
        { new: true }
    );

    return NextResponse.json({
        newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
        message: 'Product quantity increased successfully.',
        isProductQuantityIncreased: true,
    });
}
