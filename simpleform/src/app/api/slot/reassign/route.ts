import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongoose";
import Slot, { ISlot } from '../../models/Slot';
import cache from '../../utils/cache';
import FormSubmission, { IFormSubmission } from '../../models/FormSubmission';
import { AnyBulkWriteOperation } from 'mongoose';
import { RegistrationType } from '@/app/constants';
import logger from "../../../utils/logger";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await connectToDatabase();
        
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        const [slots, data] = await Promise.all([
            Slot.find({}), // Fetch all slots
            FormSubmission.find({
                status: "pending",
                registrationType: RegistrationType.FRWA,
                createdAt: { $lt: thirtyMinutesAgo }
            }),
        ]);

        if (!slots || !data) {
            return new NextResponse(JSON.stringify({ message: 'Error in fetching infromation' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const changes = {
            "2AB": { "male": 0, "female": 0 },
            "3AB": { "maleSpots": 0, "female": 0 },
            "4AB": { "male": 0, "femaleSpots": 0 },
            "6NAB": { "male": 0, "female": 0 },
        }

        data.forEach((formSubmission: IFormSubmission) => {
            const gender = formSubmission.personalDetails[0].gender;
            slots.forEach((slot: ISlot) => {
                if (formSubmission.roomQuantity && gender && formSubmission.roomQuantity[slot.bedType] > 0) {
                    if ((changes as any)[slot.bedType][gender] !== undefined) {
                        (changes as any)[slot.bedType][gender] += 1;
                    }
                }
            });
        });

        return new NextResponse(JSON.stringify({ message: "Success" }), {
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

