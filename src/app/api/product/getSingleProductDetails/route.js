import dbConnect from "@/config/dbConnect";
import productModel from "@/model/productModel";
import { NextResponse } from 'next/server';


export  async function POST(req) {
     
    await dbConnect();
  
   const reqBody = await req.json();
    const { landingPageUrl } = reqBody;
    

    if (!landingPageUrl) {
        return NextResponse.json({
            message: 'landingPageUrl is required',
            singleProductFetchSuccessful: false,
        });
    }

    try {
        // Fetch the first product with the given landingPageUrl
        const product = await productModel.findOne({ landingPageUrl });

        if (!product) {
            return NextResponse.json({
                message: 'Product not found',
                singleProductFetchSuccessful: false,
            });
        }

        return NextResponse.json({
            message: 'Product fetched successfully',
            singleProductFetchSuccessful: true,
            product,
        });
    } catch (error) {
        return NextResponse.json({
            message: 'Error fetching product',
            error: error.message,
        });
    }
}
