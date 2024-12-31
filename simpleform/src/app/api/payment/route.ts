import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "../lib/mongoose";
import FormSubmission, { IFormSubmission } from "../models/FormSubmission";
import { PaymentData } from '@/app/payment/PaymentComponent';
import { getDateDifferenceFromString } from '../utils/dateUtils';
import { priceList, YesNoType } from '@/app/constants';
import Slot, { ISlot } from '../models/Slot';
import cache from '../utils/cache';
import { generateHash } from "../utils/hashUtils";

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
        console.log(id);
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
        const foodPrice = (formSubmission.isFoodRequired === YesNoType.Yes && formSubmission.startDate && formSubmission.endDate) ?
            formSubmission.groupSize * priceList.foodFees * getDateDifferenceFromString(formSubmission.startDate, formSubmission.endDate)
            : 0;

        const accommodationPrice = (formSubmission.isPartialRetreat === YesNoType.No && formSubmission.isAccommodationRequired === YesNoType.Yes && formSubmission.roomQuantity != null && formSubmission.roomQuantity != undefined) ?
            slots.reduce<number>((acc: number, slot: ISlot, idx: number, slotArr: ISlot[]): number => {
                if (formSubmission.roomQuantity) {
                    return acc + formSubmission.roomQuantity[slot.bedType] * slot.price;
                }
                return acc;
            }, 0)
            : 0;

        const departureLunchPrice = formSubmission.isDepartureLunchRequired === YesNoType.Yes ? formSubmission.groupSize * priceList.departureLunch : 0;
        const arrivalLunchPrice = formSubmission.isArrivalLunchRequired === YesNoType.Yes ? formSubmission.groupSize * priceList.arrivalLunch : 0;
        const totalPrice = foodPrice + accommodationPrice + departureLunchPrice + arrivalLunchPrice;
        const discount = formSubmission.discount ? totalPrice * formSubmission.discount / 100 : 0;
        const finalPrice = totalPrice - discount;
        if (finalPrice !== formSubmission.charges) {
            return new NextResponse(JSON.stringify({ message: "Invalid payment details" }), {
                status: 404,
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
        return new NextResponse(JSON.stringify({ message: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}