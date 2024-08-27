import checkIfUserIsLoggedIn from '@/middleware/auth';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  // Extract tokens from cookies
  let accessToken = req.cookies.get('access-token')?.value;
  let refreshToken = req.cookies.get('refresh-token')?.value;
  
//   console.log('Access Token:', accessToken);
//   console.log('Refresh Token:', refreshToken);
  // If cookies don't have tokens, check headers
  if (!accessToken || !refreshToken) {
    accessToken = req.headers.get('access-token');
    refreshToken = req.headers.get('refresh-token');

    // console.log('Access Token:-header', accessToken);
    // console.log('Refresh Token:-header', refreshToken);

  }

  // Log the tokens for debugging purposes
//   console.log('Access Token:', accessToken);
//   console.log('Refresh Token:', refreshToken);

  // If tokens are still missing, respond with an error
  if (!accessToken || !refreshToken) {
    return NextResponse.json({
      isAuthenticated: false,
      message: 'No tokens found. Please alog in.',
    });
  }

  // Check if the user is logged in with the tokens
//   const reqBody = await  req.json()
  const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);

  // Respond based on login status
  if (isLoggedIn) {
    if (req.newAccessToken) {
       const response = NextResponse.json({
        isAuthenticated: true,
        user: req.completeUserDetails,
        newAccessToken: req.newAccessToken,
      });
      response.cookies.set('access-token', req.newAccessToken, { httpOnly: true });
      return response;
    } else {
      return NextResponse.json({
        isAuthenticated: true,
        user: req.completeUserDetails,
      });
    }
  } else {
    return NextResponse.json({
      isAuthenticated: false,
      message: 'Session has expired. Please log in again.',
    });
  }
};
