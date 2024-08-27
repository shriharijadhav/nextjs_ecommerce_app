import AddressModel from "@/model/addressModel";
import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req) => {
    // Extract request body
    const reqBody = await req.json();

    // Extract cookies from the incoming request
    const cookies = req.cookies;
    const accessToken = cookies.get('access-token')?.value;
    const refreshToken = cookies.get('refresh-token')?.value;

    // Check if tokens are present
    if (!accessToken || !refreshToken) {
        return NextResponse.json({
            message: 'Tokens missing',
            redirectUserToLogin: true,
            isAddressDeleted: false,
        });
    }

    // Call checkSession API to validate tokens
    let sessionResponse;
    try {
        sessionResponse = await axios.post('http://localhost:3000/api/auth/checkSession', {}, {
            headers: {
                'access-token': accessToken,
                'refresh-token': refreshToken,
            },
        });
    } catch (error) {
        return NextResponse.json({
            message: 'Error validating session',
            redirectUserToLogin: true,
            isAddressDeleted: false,
        });
    }

    const { isAuthenticated, newAccessToken, user } = sessionResponse.data;

    if (!isAuthenticated) {
        return NextResponse.json({
            newAccessToken: newAccessToken || null,
            message: 'Session timeout. Please log in again.',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isAddressDeleted: false,
        });
    }

    // Address deletion logic
    const { addressId } = reqBody;
    const userId = user.userProfileInfo.userId; // Extract userId from session data

    // Validate addressId
    if (!addressId) {
        return NextResponse.json({
            newAccessToken: newAccessToken || null,
            message: 'Failed to delete address. Address ID is required.',
            isAddressDeleted: false,
        });
    }

    // Attempt to delete the address
    const result = await AddressModel.deleteOne({ _id: addressId, user: userId });

    // Return response
    const response = NextResponse.json({
        message: result.deletedCount > 0 
            ? 'Address deleted successfully.' 
            : `Failed to delete address with ID ${addressId}.`,
        isAddressDeleted: result.deletedCount > 0,
    });

    // Set new access token if generated
    if (newAccessToken) {
        response.cookies.set('access-token', newAccessToken, { httpOnly: true });
    }

    return response;
};
