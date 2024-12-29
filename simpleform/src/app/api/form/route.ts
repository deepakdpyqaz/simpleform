import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "../lib/mongoose";
import FormSubmission, { IFormSubmission } from "../models/FormSubmission";
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const body: Partial<IFormSubmission> = await req.json();
    const newSubmission = new FormSubmission(body);
    const savedSubmission = await newSubmission.save();

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


export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return new NextResponse(JSON.stringify({ message: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const formSubmission: IFormSubmission | null= await FormSubmission.findById(id);

    if (!formSubmission) {
      return new NextResponse(JSON.stringify({ message: 'Form submission not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    let rooms = 0;
    let extraBed = 0;
    if(formSubmission.accommodationType === "room"){
      rooms = Math.floor(formSubmission.groupSize/2);
      extraBed = formSubmission.groupSize % 2;
    }
    const paymentData = {
      groupSize: formSubmission.groupSize,
      rooms: rooms,
      extraBed: extraBed,
      accommodationType: formSubmission.accommodationType,
      food: formSubmission.isFoodRequired,
      totalCharges: formSubmission.charges
    }
    return new NextResponse(JSON.stringify(paymentData), {
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