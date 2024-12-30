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