import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "../lib/mongoose";
import FormSubmission, { IFormSubmission } from "../models/FormSubmission";
import Slot, { ISlot } from '../models/Slot';
import { AnyBulkWriteOperation } from 'mongoose';
import { YesNoType } from '@/app/constants';
import { sendSuccessEmail } from '../utils/mailer';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const body: Partial<IFormSubmission> = await req.json();
    const newSubmission = new FormSubmission(body);
    const slots: ISlot[] = await Slot.find({});
    const newSlots: AnyBulkWriteOperation[] = slots.map((slot: ISlot, idx: number) => {
      let reqSlots = newSubmission.roomQuantity[slot.bedType] || 0;
      let gender = newSubmission.personalDetails[0].gender;
      if (gender != "male" && gender != "female") {
        throw new Error("Invalid gender");
      }
      if (slot.neutralSpotsAvailable + (
        gender === "male" ? slot.maleSpotsAvailable : slot.femaleSpotsAvailable
      ) < reqSlots) {
        throw new Error("Spot not available");
      }
      if (gender === "male") {
        if (slot.maleSpotsAvailable >= reqSlots) {
          return {
            updateMany: {
              filter: { bedType: slot.bedType },
              update: { $inc: { maleSpotsAvailable: -reqSlots, maleSpotsHold: reqSlots } },
            }
          };
        } else if (slot.neutralSpotsAvailable >= reqSlots) {
          return {
            updateMany: {
              filter: { bedType: slot.bedType },
              update: { $inc: { neutralSpotsAvailable: -slot.spotsAvailable, maleSpotsHold: reqSlots, maleSpotsAvailable: (slot.spotsAvailable - reqSlots) } },
            }
          };
        } else {
          throw new Error("Spot not available");
        }
      }
      else if (gender === "female") {
        if (slot.femaleSpotsAvailable >= reqSlots) {
          return {
            updateMany: {
              filter: { bedType: slot.bedType },
              update: { $inc: { femaleSpotsAvailable: -reqSlots, femaleSpotsHold: reqSlots } },
            }
          };
        } else if (slot.neutralSpotsAvailable >= reqSlots) {
          return {
            updateMany: {
              filter: { bedType: slot.bedType },
              update: { $inc: { neutralSpotsAvailable: -slot.spotsAvailable, femaleSpotsHold: reqSlots, femaleSpotsAvailable: (slot.spotsAvailable - reqSlots) } },
            }
          };
        } else {
          throw new Error("Spot not available");
        }
      }
      else {
        throw new Error("Invalid gender");
      }
    });
    if (newSubmission.charges == 0) {
      newSubmission.status = "success";
    }
    const savedSubmission = await newSubmission.save();
    Slot.bulkWrite(newSlots); // Async call to not block user flow
    if (savedSubmission.charges == 0) {
      sendSuccessEmail(savedSubmission);
      return new NextResponse(JSON.stringify({ message: 'Form submitted succesfully', isPaymentRequired: YesNoType.No, id: savedSubmission._id }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new NextResponse(JSON.stringify({ message: 'Form submitted succesfully', isPaymentRequired: YesNoType.Yes, id: savedSubmission._id }), {
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


export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const credential = searchParams.get('credential');

  // Check if the 'credential' matches the server-side valid credential
  if (credential !== process.env.VALID_CREDENTIAL || 'vihe') {
    // If the credential doesn't match, return 401 Unauthorized
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Sample data to be included in the Excel file
  const data = await FormSubmission.find({ status: "success" });
  const json_data = JSON.parse(JSON.stringify(data));
  data.forEach((obj, idx) => {
    json_data[idx]["roomQuantity"] = JSON.stringify(obj.roomQuantity);
    json_data[idx]["personalDetails"] = JSON.stringify(obj.personalDetails);
  })

  // Create a new worksheet from the data
  const ws = XLSX.utils.json_to_sheet(json_data);

  // Create a new workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Write the workbook to a buffer
  const fileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

  // Create a NextResponse with the file buffer
  const response = new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=submitted_forms.xlsx',
    },
  });

  return response;
}