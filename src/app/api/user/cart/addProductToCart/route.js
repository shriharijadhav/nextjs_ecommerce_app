import dbConnect from '@/config/dbConnect';
import axios from 'axios';
import cartModel from '@/model/cartModel';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  // Make db connection
  await dbConnect();

  const reqBody = await req.json();

  // Extract cookies from the incoming request
  const cookies = req.cookies;
  const accessToken = cookies.get('access-token')?.value;
  const refreshToken = cookies.get('refresh-token')?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({
      message: 'Tokens missing',
      redirectUserToLogin: true,
      isProductAddedToCart: false,
    });
  }

  // Call checkSession API to verify session status
  const sessionResponse = await axios.post('http://localhost:3000/api/auth/checkSession', {}, {
    headers: {
      'access-token': accessToken,
      'refresh-token': refreshToken,
    },
  });

  const { isAuthenticated, newAccessToken, user } = sessionResponse.data;

  if (!isAuthenticated) {
    return NextResponse.json({
      newAccessToken: newAccessToken || null,
      message: 'Session timeout. Refresh token expired.',
      isRefreshTokenExpired: true,
      redirectUserToLogin: true,
      isProductAddedToCart: false,
    });
  }

  // Logic for adding product to cart starts here
  const { productFromRequest } = reqBody;
  const userId = user.userProfileInfo.userId;
  const cartId = user?.userCart?._id;

  if (!productFromRequest || !userId || !cartId) {
    return NextResponse.json({
      newAccessToken: newAccessToken || null,
      message: 'Either productFromRequest, user id or cart is missing in request.',
      isProductAddedToCart: false,
    });
  }

  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    return NextResponse.json({
      newAccessToken: newAccessToken || null,
      message: 'Cart not found for user with id ' + userId,
      isProductAddedToCart: false,
    });
  }

  // Check if the product already exists in the cart
  let existingProduct = cart?.allProductsInCart?.find(
    (product) => product._id.toString() === productFromRequest._id.toString()
  );

  let updatedCart;
  if (!existingProduct) {
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

  // Return response and set new access token if generated
  const response = NextResponse.json({
    newAccessToken: newAccessToken || null,
    message: 'Product added to cart successfully.',
    isProductAddedToCart: true,
  });

  if (newAccessToken) {
    console.log('New access token sent over cookie');
    response.cookies.set('access-token', newAccessToken, { httpOnly: true });
  }

  return response;
};
