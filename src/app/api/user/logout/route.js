import dbConnect from '@/config/dbConnect';
import checkIfUserIsLoggedIn from '@/middleware/auth';
import blacklistedTokenModel from '@/model/blacklistedToken';
import { NextResponse } from 'next/server';

export const  POST = async (req)=> {
  
    await dbConnect();

    try {

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


        const isLoggedIn = await checkIfUserIsLoggedIn(req, accessToken, refreshToken);

        if (!isLoggedIn) {
            return NextResponse.json({
                message: "Session timeout. Refresh token expired",
                isRefreshTokenExpired: true,
                isUserLoggedOut: true,
                redirectUserToLogin: true,
            });
        }

        const userId = req?.userId;

        const blacklistedToken = await blacklistedTokenModel.create({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userId,
        });

        if (blacklistedToken) {
            // Create the response object
        const response = NextResponse.json({
            message: 'User logged out successfully',
            isUserLoggedOut: true,
            redirectUserToLogin: true,
        });

        // Delete the 'access-token' and 'refresh-token' cookies by setting them to expire immediately
        response.cookies.set('access-token', '', { expires: new Date(0), httpOnly: true });
        response.cookies.set('refresh-token', '', { expires: new Date(0), httpOnly: true });

        return response;

        }

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to logout',
            details: error.message,
        });
    }
}
