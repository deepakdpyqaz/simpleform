import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../lib/mongoose";
import Coupon, { ICoupon } from "../models/Coupon";
import logger from "@/app/utils/logger";

export async function GET(req: NextRequest): Promise<NextResponse> {
    try{
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const couponCode = searchParams.get('coupon');
        const coupon: ICoupon|null = await Coupon.findOne({"name": couponCode});
        if (coupon){
            return new NextResponse(JSON.stringify(coupon), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        else{
            return new NextResponse(JSON.stringify({ message: 'Coupon not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }
    catch(error){
        console.error(error);
        logger.error(`Error in GET /api/coupon: ${error} : URL : ${req.url}`);
        return new NextResponse(JSON.stringify({ message: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}