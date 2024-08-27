import AddressModel from '@/model/addressModel';
import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req) => {
  const reqBody = await req.json();

  // Extract cookies from the incoming request
  const cookies = req.cookies;
  const accessToken = cookies.get('access-token')?.value;
  const refreshToken = cookies.get('refresh-token')?.value;

  // Check if the user is logged in by calling the checkSession API
  const sessionResponse = await axios.post('http://localhost:3000/api/auth/checkSession', {}, {
    headers: {
      'access-token': accessToken,
      'refresh-token': refreshToken,
    },
  });

 
  const { isAuthenticated, newAccessToken, user } = sessionResponse.data;

//   console.log('newAccessToken',newAccessToken)

  if (!isAuthenticated) {
     return NextResponse.json({
      newAccessToken: newAccessToken || null,
      message: 'Session timeout. Please log in again.',
      isAuthenticated,
      isRefreshTokenExpired: true,
      redirectUserToLogin: true,
      isAddressSaved: false,
    });
  }

  // Destructure address details from the request body
  const { houseAddress, street, city, state, postalCode, country, phoneNumber } = reqBody;

  if (!houseAddress || !street || !city || !state || !postalCode || !country || !phoneNumber) {
    return NextResponse.json({
      newAccessToken: newAccessToken || null,
      message: 'Some fields are missing.',
      isAddressSaved: false,
    });
  }

  // Proceed with address creation
  const userId = user.userProfileInfo.userId;
  const allAddresses = await AddressModel.find({ user: userId });

  let savedAddress;
  if (allAddresses.length === 0) {
    // Set isDefault to true for the first address
    savedAddress = await AddressModel.create({
      houseAddress,
      street,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      isDefault: true,
      user: userId,
    });
  } else {
    savedAddress = await AddressModel.create({
      houseAddress,
      street,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      user: userId,
    });
  }

  // Return response and set new access token if generated
  const response = NextResponse.json({
    message: savedAddress ? 'Address saved successfully.' : 'Failed to save address. Please try again.',
    savedAddress,
    isAddressSaved: true,
  });

  if (newAccessToken) {
    // console.log('new access token sent over cookie')
    response.cookies.set('access-token', newAccessToken, { httpOnly: true });
  }

  return response;
};
