import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../lib/mongoose";
import { generateReverseHash } from "../../utils/hashUtils";
import FormSubmission, { IFormSubmission } from "../../models/FormSubmission";
import Slot, { ISlot } from "../../models/Slot";
import Transaction, { ITransaction } from "../../models/Transaction";
import { AnyBulkWriteOperation } from "mongoose";
import { MailOptions, sendEmail } from "../../utils/mailer";

const MAIL_SUBJECT = "Registration confirmation for Saranagati Retreat (Feb 23 - Mar 1)";
const MAIL_BODY = `
Hare Krsna dear devotee,
Please accept my humble obeisances. All glories to Srila Prabhupada.
Thank you for registering for the Saranagati Retreat (Feb 23 - Mar 1)`
const MAIL_HTML = `
<p><strong>Hare Krsna dear devotee,</strong></p>
<p>Please accept my humble obeisances. All glories to Srila Prabhupada.</p>
<p>Thank you for registering for the Saranagati Retreat (Feb 23 - Mar 1)</p>
`;
const attachments = [
    {
        filename: "GRC_QRcode.pdf",
        path: "./GRC_QRcode.pdf"
    },
    {
        filename: "Saranagati_Retreat_Brochure.pdf",
        path: "./Saranagati_Retreat_Brochure.pdf"
    }
]

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
        if (key && txnid && amount && productinfo && productinfo && email && firstname && phone && status) {
            const hash = generateReverseHash(key, txnid, amount, productinfo, firstname, email, status, udf1, udf2, udf3, udf4, udf5);
            if (hash !== receivedHash) {
                throw new Error("Error in payment");
            }
            const [formSubmission, slots] = await Promise.all([FormSubmission.findById(txnid), Slot.find()]);
            if (formSubmission != null && slots != null) {
                const newSlots: AnyBulkWriteOperation[] = slots.map((slot: ISlot, idx: number) => {
                    let reqSlots = formSubmission && formSubmission.roomQuantity ? formSubmission.roomQuantity[slot.bedType] : 0;
                    return {
                        updateMany: {
                            filter: { bedType: slot.bedType },
                            update: { $inc: { hold: -reqSlots } }
                        }
                    }
                })
                formSubmission.status = "success";
                const transaction = new Transaction({ txnid, mihpayid, mode, status, bank_ref_num });
                await Promise.all([Slot.bulkWrite(newSlots), formSubmission.save(), transaction.save()]);
                const mailOptions: MailOptions = {
                    to: formSubmission.email,
                    subject: MAIL_SUBJECT,
                    text: MAIL_BODY,
                    html: MAIL_HTML,
                    attachments: attachments
                }
                sendEmail(mailOptions);
            }
            else {
                throw new Error("Error in setting slots");
            }
        } else {
            throw new Error("Error in payment");
        }
        return NextResponse.redirect(new URL(`/payment/success`,req.url));
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL(`/payment/failure`,req.url));
    }

}