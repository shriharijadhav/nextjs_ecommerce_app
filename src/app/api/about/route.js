import { NextRequest, NextResponse } from "next/server";

// Handling GET request
export const GET = (request) => {
    // Access request details using NextRequest methods
    const { headers, url } = request;
    
    return NextResponse.json({
        message: "hi there",
    });
};

// Handling POST request
export const POST = async (request) => {
    // Reading the request body
    const body = await request.json();
    
    return NextResponse.json({
        message: "POST request received",
        data: body,
    });
};
