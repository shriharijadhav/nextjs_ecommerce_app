

import checkIfUserIsLoggedIn from "@/middleware/auth";
import AddressModel from "@/model/addressModel";
import { NextResponse } from "next/server";


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
        return  NextResponse.json({
            newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message: 'Session timeout. Refresh token expired',
            isRefreshTokenExpired: true,
            redirectUserToLogin: true,
            isProductQuantityDecreased: false,
        });
    }
    // logic for deleting address starts here
    const {addressId} = reqBody;
    let userId = reqBody?.userId;
    if(!addressId || !userId) {
        return NextResponse.json({
            newAccessToken:reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message:'Failed to delete Address.Address ID and User ID is required to delete a address.',
            isAddressDeleted:false
        });
    }

    const deletedAddress = await AddressModel.deleteOne({ _id: addressId, user: userId });
   

    // logic for deleting address ends here   
    
    
    return NextResponse.json({
        newAccessToken:reqBody.newAccessToken ? reqBody.newAccessToken : null,
        message:deletedAddress?'Address deleted successfully':'failed to delete the address with id'+addressId,
        isAddressDeleted:true
    });
}
