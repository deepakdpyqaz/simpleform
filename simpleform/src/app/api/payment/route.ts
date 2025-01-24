import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "../lib/mongoose";
import FormSubmission, { IFormSubmission } from "../models/FormSubmission";
import { PaymentData } from '@/app/payment/PaymentComponent';
import { getDateDifferenceFromString } from '../utils/dateUtils';
import { priceList, YesNoType } from '@/app/constants';
import Slot, { ISlot } from '../models/Slot';
import cache from '../utils/cache';
import { generateHash } from "../utils/hashUtils";
import { chargeCalculator } from '../utils/chargeUtils';
import logger from '@/app/utils/logger';
import Transaction, { ITransaction } from '../models/Transaction';


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
        const formSubmission: IFormSubmission | null = await FormSubmission.findById(id);

        if (!formSubmission) {
            return new NextResponse(JSON.stringify({ message: 'Form submission not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        let slots: ISlot[] | null;
        const cachedSlots: ISlot[] | null = cache.get("slots") as ISlot[];
        if (!cachedSlots) {
            slots = await Slot.find({});
            cache.set("slots", slots);
        }
        else {
            slots = cachedSlots;
        }
        const { foodPrice, partialRetreatPrice, accommodationPrice, departureLunchPrice, arrivalLunchPrice, totalPrice, discount, finalPrice } = await chargeCalculator(formSubmission);
        if (finalPrice !== formSubmission.charges) {
            logger.error(`${id} : Calculated price ${finalPrice} does not match with form submission charges ${formSubmission.charges}`);
            return new NextResponse(JSON.stringify({ message: "Invalid payment details, charges doesn't match with calculated" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        const successUrl = `${process.env.FQDN}/api/payment/success?id=${id}`;
        const failureUrl = `${process.env.FQDN}/api/payment/failure?id=${id}`;
        const key = process.env.PAYU_KEY || '';
        const pinfo = `Submission_${id}`;
        const fname = formSubmission.personalDetails[0].name;
        const email = formSubmission.email
        const phoneNumber = formSubmission.personalDetails[0].whatsappNumber;
        const hash = generateHash(key, id, finalPrice, pinfo, fname, email);

        const paymentData: PaymentData = {
            groupSize: formSubmission.groupSize,
            partialRetreat: partialRetreatPrice,
            food: foodPrice,
            totalCharges: finalPrice,
            accommodation: accommodationPrice,
            departureLunch: departureLunchPrice,
            arrivalLunch: arrivalLunchPrice,
            coupon: discount,
            key: key,
            txnid: id,
            productinfo: pinfo,
            email: email,
            firstname: fname,
            surl: successUrl,
            furl: failureUrl,
            phone: phoneNumber,
            hash: hash
        }
        return new NextResponse(JSON.stringify(paymentData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        logger.error(`Error in GET /api/payment: ${error} : URL : ${req.url}`);
        return new NextResponse(JSON.stringify({ message: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await connectToDatabase();

        const filters: Partial<ITransaction> = await req.json();

        const transactions = await Transaction.find(filters);

        return new NextResponse(JSON.stringify({ success: true, data: transactions }), {
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
        });
    }
    catch (error) {
        console.error(error);
        logger.error(`Error in POST /api/payment: ${error} : URL : ${req.url}`);
        return new NextResponse(JSON.stringify({ message: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}