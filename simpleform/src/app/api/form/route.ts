import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "../lib/mongoose";
import FormSubmission, { IFormSubmission } from "../models/FormSubmission";
import Slot, { ISlot } from '../models/Slot';
import { AnyBulkWriteOperation } from 'mongoose';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const body: Partial<IFormSubmission> = await req.json();
    const newSubmission = new FormSubmission(body);
    const slots: ISlot[] = await Slot.find({});
    const newSlots: AnyBulkWriteOperation[] = slots.map((slot: ISlot, idx: number) => {
      let reqSlots = newSubmission.roomQuantity[slot.bedType] || 0;
      if (slot.available < reqSlots) {
        throw new Error("Spot not available");
      }
      return {
        updateMany: {
          filter: { bedType: slot.bedType },
          update: { $inc: { available: -reqSlots, hold: reqSlots } },
        }
      };
    })
    const savedSubmission = await newSubmission.save();
    Slot.bulkWrite(newSlots); // Async call to not block user flow

    return new NextResponse(JSON.stringify({ message: 'Form submitted succesfully', id: savedSubmission._id }), {
      status: 201,
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