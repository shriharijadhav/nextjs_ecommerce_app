import checkIfUserIsLoggedIn from '@/middleware/auth';
import productModel from '@/model/productModel';
import { NextResponse } from 'next/server';
 
export const POST = async (req)=> {

    const reqBody = await req.json();

    // const accessToken = req.headers.get('access-token');
    // const refreshToken = req.headers.get('refresh-token');

    // if (!accessToken || !refreshToken) {
    //     return NextResponse.json({
    //         message: 'Tokens missing',
    //         redirectUserToLogin: true,
    //         isProductQuantityIncreased: false,
    //     });
    // }

    // const isLoggedIn = await checkIfUserIsLoggedIn(reqBody, accessToken, refreshToken);
    // if (!isLoggedIn) {
    //     return  NextResponse.json({
    //         newAccessToken: reqBody.newAccessToken ? reqBody.newAccessToken : null,
    //         message: 'Session timeout. Refresh token expired',
    //         isRefreshTokenExpired: true,
    //         redirectUserToLogin: true,
    //         isProductQuantityDecreased: false,
    //     });
    // }

   

    const { page = 1, gender, category } = reqBody; // Default to page 1 if not provided
    const limit = 15; // Number of products per page
    const skip = (page - 1) * limit;

    try {
        // Build the query object with filters
        let query = {};
        if (gender) {
            query.gender = gender;
        }
        if (category) {
            query.category = category;
        }

        // Fetch products with pagination and filters
         const products = await productModel.find({gender: gender, category: category})
            .skip(skip)
            .limit(limit);

        // Get total count for pagination purposes
        const totalProducts = await productModel.find({gender: gender, category: category});

        return NextResponse.json({
            message: 'Products fetched successfully',
            page,
            gender,
            category,
            totalProductCountPerCategory:totalProducts?.length ? totalProducts?.length : 0,
            totalPages: Math.ceil((totalProducts?.length) / limit),
            products,
        });
    } catch (error) {
        return NextResponse.json({
            message: 'Error fetching products',
            error: error.message,
        });
    }
}
