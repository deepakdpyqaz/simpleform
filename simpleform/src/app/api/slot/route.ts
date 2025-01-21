import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "../lib/mongoose";
import Slot, { ISlot } from '../models/Slot';
import cache from '../utils/cache';
import FormSubmission, { IFormSubmission } from '../models/FormSubmission';
import { AnyBulkWriteOperation } from 'mongoose';
import { RegistrationType } from '@/app/constants';
import logger from "../../utils/logger";
import { checkAdminAccess } from '../authorization/adminAuthorize';
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const priceOnly = searchParams.get('priceOnly');
        let slots: ISlot[] | null;
        let isCached: boolean = false;
        if (priceOnly) {
            const cachedSlots: ISlot[] | null = cache.get("slots") as ISlot[];
            if (!cachedSlots) {
                slots = await Slot.find({});
                cache.set("slots", slots);
                isCached = false;
            }
            else {
                slots = cachedSlots;
                isCached = true;
            }
        } else {
            slots = await Slot.find({});
            cache.set("slots", slots);
        }

        if (!slots) {
            logger.error(`No slots found: searchParams: ${searchParams}`);
            return new NextResponse(JSON.stringify({ message: 'No slots found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new NextResponse(JSON.stringify({ slots, priceOnly, isCached }), {
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

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await connectToDatabase();
        if (!checkAdminAccess(req)){
            return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const updateSlotRequest: ISlot[] = await req.json();
        const updatedSlots: AnyBulkWriteOperation[] = updateSlotRequest.map((slot: ISlot) => {
            return {
                updateMany: {
                    filter: { bedType: slot.bedType },
                    update: {
                        $set: {
                            spotsAvailable: slot.spotsAvailable,
                            totalCapacity: slot.totalCapacity,
                            neutralSpotsAvailable: slot.neutralSpotsAvailable,
                            maleSpotsAvailable: slot.maleSpotsAvailable,
                            femaleSpotsAvailable: slot.femaleSpotsAvailable,
                            maleSpotsHold: slot.maleSpotsHold,
                            femaleSpotsHold: slot.femaleSpotsHold,
                        },
                    },
                },
            };
        });
        await Slot.bulkWrite(updatedSlots);
        return new NextResponse(JSON.stringify({ status: "OK", message: "Slots updated successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}