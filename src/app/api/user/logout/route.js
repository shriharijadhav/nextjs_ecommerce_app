import dbConnect from '@/config/dbConnect';
import checkIfUserIsLoggedIn from '@/middleware/auth';
import blacklistedTokenModel from '@/model/blacklistedToken';
import { NextResponse } from 'next/server';

export const  POST = async (req)=> {
  
    await dbConnect();

    try {

        const reqBody = await req.json()
        const { accessToken, refreshToken } = reqBody;

        if(!accessToken|| !refreshToken ){
            return NextResponse.json({
                message: 'failed to logout',
                isUserLoggedOut: false,
                redirectUserToLogin: false,
            });  
        }


        const isLoggedIn = await checkIfUserIsLoggedIn(reqBody, accessToken, refreshToken);

        if (!isLoggedIn) {
            return NextResponse.json({
                message: "Session timeout. Refresh token expired",
                isRefreshTokenExpired: true,
                isUserLoggedOut: true,
                redirectUserToLogin: true,
            });
        }

        const userId = reqBody?.userId;

        const blacklistedToken = await blacklistedTokenModel.create({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userId,
        });

        if (blacklistedToken) {
            return NextResponse.json({
                message: 'User logged out successfully',
                isUserLoggedOut: true,
                redirectUserToLogin: true,
            });
        }

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to logout',
            details: error.message,
        });
    }
}
