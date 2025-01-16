import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../lib/mongoose";
import { generateReverseHash } from "../../utils/hashUtils";
import FormSubmission, { IFormSubmission } from "../../models/FormSubmission";
import Slot, { ISlot } from "../../models/Slot";
import Transaction, { ITransaction } from "../../models/Transaction";
import { AnyBulkWriteOperation } from "mongoose";
import { MailOptions, sendEmail, sendSuccessEmail } from "../../utils/mailer";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await connectToDatabase();
        const rawBody = await req.text();
        const body = new URLSearchParams(rawBody);
        const key = body.get('key');
        const txnid = body.get('txnid');
        const amount = body.get('amount');
        const productinfo = body.get('productinfo');
        const email = body.get('email');
        const firstname = body.get('firstname');
        const phone = body.get('phone');
        const status = body.get('status');
        const receivedHash = body.get('hash');
        const mihpayid = body.get('mihpayid');
        const mode = body.get('mode');
        const bank_ref_num = body.get('bank_ref_num');
        const udf1 = body.get('udf1') || '';
        const udf2 = body.get('udf2') || '';
        const udf3 = body.get('udf3') || '';
        const udf4 = body.get('udf4') || '';
        const udf5 = body.get('udf5') || '';
        const additionalCharges = body.get('additionalCharges') || '';
        if (key && txnid && amount && productinfo && productinfo && email && firstname && phone && status && bank_ref_num && status === "success") {
            const hash = generateReverseHash(key, txnid, amount, productinfo, firstname, email, status, udf1, udf2, udf3, udf4, udf5, additionalCharges);
            if (hash !== receivedHash) {
                throw new Error("Error in payment");
            }
            const [formSubmission, slots] = await Promise.all([FormSubmission.findById(txnid), Slot.find()]);
            if (formSubmission != null && slots != null) {
                const newSlots: AnyBulkWriteOperation[] = slots.map((slot: ISlot, idx: number) => {
                    let reqSlots = formSubmission && formSubmission.roomQuantity ? formSubmission.roomQuantity[slot.bedType] : 0;
                    let gender = formSubmission.personalDetails[0].gender;
                    if (gender === "male") {
                            return {
                                updateMany: {
                                    filter: { bedType: slot.bedType },
                                    update: { $inc:  {maleSpotsHold: -reqSlots } },
                                }
                            };
                    }
                    else if (gender === "female") {
                        return {
                            updateMany: {
                                filter: { bedType: slot.bedType },
                                update: { $inc: {femaleSpotsHold: reqSlots } },
                            }
                        };
                    }
                    else{
                        throw new Error("invalid gender");
                    }
                })
                formSubmission.status = "success";
                const transaction = new Transaction({ txnid, mihpayid, mode, status, bank_ref_num });
                await Promise.all([Slot.bulkWrite(newSlots), formSubmission.save(), transaction.save()]);
                sendSuccessEmail(formSubmission);
            }
            else {
                throw new Error("Error in setting slots");
            }
        } else {
            throw new Error("Error in payment");
        }
        return NextResponse.redirect(new URL(`/payment/success`, req.url),303);
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL(`/payment/failure`, req.url),303);
    }

}
/* INFO: This is for debugging purposes only*/
// export async function GET(req: NextRequest): Promise<NextResponse>{
//     const formSubmission = new FormSubmission();
//     formSubmission._id = "123456";
//     formSubmission.email = "deepakdpynew@gmail.com";
//     formSubmission.groupSize = 3;
//     formSubmission.registrationType = RegistrationType.FRWA;
//     formSubmission.room
//     sendSuccessEmail(formSubmission);
//     return new NextResponse(JSON.stringify({ "message": "success" }), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//     })
// }
