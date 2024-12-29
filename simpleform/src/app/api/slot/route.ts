import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "../lib/mongoose";
import Slot, { ISlot } from '../models/Slot';
import cache from '../utils/cache';
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const priceOnly = searchParams.get('priceOnly');
        let slots: ISlot[] | null ;
        let isCached: boolean = false;
        if(priceOnly){
            const cachedSlots: ISlot[] | null = cache.get("slots") as ISlot[];
            if(!cachedSlots){
                slots = await Slot.find({});
                cache.set("slots", slots);
                isCached = false;
            }
            else{
                slots = cachedSlots;
                isCached = true;
            }
        }else{
            slots = await Slot.find({});
            cache.set("slots", slots);
        }

        if (!slots) {
            return new NextResponse(JSON.stringify({ message: 'No slots found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new NextResponse(JSON.stringify({slots,priceOnly,isCached}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

}

