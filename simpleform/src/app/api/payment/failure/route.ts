import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../lib/mongoose";
import { generateReverseHash } from "../../utils/hashUtils";
import FormSubmission, { IFormSubmission } from "../../models/FormSubmission";
import Slot, { ISlot } from "../../models/Slot";
import Transaction, { ITransaction } from "../../models/Transaction";
import { AnyBulkWriteOperation } from "mongoose";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await connectToDatabase();
        const body = await req.json();
        const key = body['key'];
        const txnid = body['txnid'];
        const amount = body['amount'];
        const productinfo = body['productinfo'];
        const email = body['email'];
        const firstname = body['firstname'];
        const surl = body['surl'];
        const furl = body['furl'];
        const phone = body['phone'];
        const status = body['status'];
        const receivedHash = body['hash'];
        const mihpayid = body['mihpayid'];
        const mode = body['mode'];
        const bank_ref_num = body['bank_ref_num'];
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
                            update: { $inc: { hold: -reqSlots, available: reqSlots } }
                        }
                    }
                })
                formSubmission.status = "failure";
                const transaction = new Transaction({txnid,mihpayid,mode,status,bank_ref_num});
                await Promise.all([Slot.bulkWrite(newSlots),formSubmission.save(), transaction.save()])
            }
            else{
                throw new Error("Error in setting slots");
            }
        } else {
            throw new Error("Error in payment");
        }
        return NextResponse.redirect(new URL("/payment/failure", req.url));
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL("/payment/failure", req.url));
    }

}