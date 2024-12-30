import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../lib/mongoose";
import { generateReverseHash } from "../../utils/hashUtils";
import FormSubmission, { IFormSubmission } from "../../models/FormSubmission";
import Slot, { ISlot } from "../../models/Slot";
import Transaction, { ITransaction } from "../../models/Transaction";
import { AnyBulkWriteOperation } from "mongoose";
import { MailOptions, sendEmail } from "../../utils/mailer";

const MAIL_SUBJECT= "Registration confirmation for Saranagati Retreat (Feb 23 - Mar 1)";
const MAIL_BODY=`
Hare Krsna dear devotee,
Please accept my humble obeisances. All glories to Srila Prabhupada.
Thank you for registering for the Saranagati Retreat (Feb 23 - Mar 1)`
const MAIL_HTML=`
<p><strong>Hare Krsna dear devotee,</strong></p>
<p>Please accept my humble obeisances. All glories to Srila Prabhupada.</p>
<p>Thank you for registering for the Saranagati Retreat (Feb 23 - Mar 1)</p>
`;
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('key');
        const txnid = searchParams.get('txnid');
        const amount = searchParams.get('amount');
        const productinfo = searchParams.get('productinfo');
        const email = searchParams.get('email');
        const firstname = searchParams.get('firstname');
        const surl = searchParams.get('surl');
        const furl = searchParams.get('furl');
        const phone = searchParams.get('phone');
        const status = searchParams.get('status');
        const receivedHash = searchParams.get('hash');
        const mihpayid = searchParams.get('mihpayid');
        const mode = searchParams.get('mode');
        const bank_ref_num = searchParams.get('bank_ref_num');
        if (key && txnid && amount && productinfo && productinfo && email && firstname && surl && furl && phone && status) {
            const hash = generateReverseHash(key, txnid, Number(amount), productinfo, firstname, email, status);
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
                const transaction = new Transaction({txnid,mihpayid,mode,status,bank_ref_num});
                await Promise.all([Slot.bulkWrite(newSlots),formSubmission.save(), transaction.save()]);
                const mailOptions: MailOptions = {
                    to: formSubmission.email,
                    subject: MAIL_SUBJECT,
                    text: MAIL_BODY,
                    html: MAIL_HTML
                }
                sendEmail(mailOptions);
            }
            else{
                throw new Error("Error in setting slots");
            }
        } else {
            throw new Error("Error in payment");
        }
        return NextResponse.redirect(new URL("/payment/success", req.url));
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL("/payment/failure", req.url));
    }

}