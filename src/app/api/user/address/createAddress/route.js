import checkIfUserIsLoggedIn from '@/middleware/auth';
import AddressModel from '@/model/addressModel';
import { NextResponse } from 'next/server';


export const POST =async (req)=> {
  
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

    // logic for creating address starts here
    const {houseAddress,street,city,state,postalCode,country,phoneNumber} = reqBody;

    if(!houseAddress || !street || !city || !state || !postalCode || !country || !phoneNumber) {
        return NextResponse.json({
            newAccessToken:reqBody.newAccessToken ? reqBody.newAccessToken : null,
            message:'Some of the fields are missing',
            isAddressSaved:false
        });
    }

    let userId = reqBody?.userId;

    const allAddresses = await AddressModel.find({user:userId});

    let savedAddress;
    // check if at least one address has been added already - if not, create a new one and set isDefault property to true
    if(allAddresses.length===0) {
        savedAddress = await AddressModel.create({houseAddress,street,city,state,postalCode,country,phoneNumber,isDefault:true,user:userId})
    }else{
        savedAddress = await AddressModel.create({houseAddress,street,city,state,postalCode,country,phoneNumber,user:userId})
    }

     

    // logic for creating address ends here   
    
    
    return NextResponse.json({
        newAccessToken:reqBody.newAccessToken ? reqBody.newAccessToken : null,
        message:savedAddress?'Address saved successfully':'Failed to save address. Please try again.',
        savedAddress,
        isAddressSaved:true,
        

    });
}
