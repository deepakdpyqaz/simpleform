"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { AccommodationType, YesNoType } from "../constants";
import { priceList } from "../constants";
interface PaymentData {
    groupSize: number;
    accommodation: number;
    food: number;
    departureLunch: number;
    arrivalLunch: number;
    coupon: number;
    totalCharges: number;
    key: string;
    txnid: string;
    productinfo: string;
    email: string;
    firstname: string;
    surl: string;
    furl: string;
    phone: string;
    hash: string;
}
const defaultPaymentData: PaymentData = {
    groupSize: 1,
    food: 0,
    totalCharges: 0,
    accommodation: 0,
    departureLunch: 0,
    arrivalLunch: 0,
    coupon: 0,
    key: "",
    txnid: "",
    productinfo: "",
    email: "",
    firstname: "",
    surl: "",
    furl: "",
    phone: "",
    hash: ""
}
export default function PaymentComponent() {
    const PAYU_URL=process.env.NEXT_PUBLIC_PAYU_URL;
    const router = useRouter();
    const searchParams = useSearchParams();
    const [id, setId] = useState("");
    const [paymentData, setPaymentData] = useState<PaymentData>(defaultPaymentData);
    const fetchPaymentData = async () => {
        try {
            const response = await fetch(`api/form?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                setPaymentData({
                    groupSize: data.groupSize,
                    accommodation: data.accommodationType,
                    departureLunch: data.departureLunch,
                    arrivalLunch: data.arrivalLunch,
                    coupon: data.coupon,
                    food: data.food,
                    totalCharges: data.charges
                } as PaymentData);
            } else {
                const errorData = await response.json();
                alert("Error fetching payment data: " + errorData.error);
                router.push("/");
            }
        } catch (error) {
            alert("Error fetching payment data: " + error);
            router.push("/");
        }
    }
    useEffect(() => {
        const submissionId = searchParams.get('submissionId');
        if (submissionId !== null) {
            setId(submissionId);
            fetchPaymentData();
        } else {
            alert("Invalid submission");
            router.push("/");
        }
    }, []);

    return (
        <form action={PAYU_URL} method='post' className="bg-white shadow-2xl rounded-xl p-8 max-w-lg mx-auto border border-teal-300">
            <div className="mb-8">
                <label className="block text-sm font-semibold text-teal-800">Number of people: {paymentData?.groupSize}</label>
            </div>
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-teal-800 border-b">Ammeneties</th>
                            <th className="px-4 py-2 text-teal-800 border-b">Contribution</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td className="px-4 py-2 border-b">Accommodation</td>
                                <td className="px-4 py-2 border-b">Rs.{paymentData?.accommodation}/-</td>
                            </tr> 
                            <tr>
                                <td className="px-4 py-2 border-b">Prasad during retreat</td>
                                <td className="px-4 py-2 border-b">Rs.{paymentData?.food}/-</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b">Lunch during arrival</td>
                                <td className="px-4 py-2 border-b">Rs.{paymentData?.arrivalLunch}/-</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b">Lunch during departure</td>
                                <td className="px-4 py-2 border-b">Rs.{paymentData?.departureLunch}/-</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b">Discount</td>
                                <td className="px-4 py-2 border-b">Rs.{paymentData?.coupon*(paymentData?.departureLunch + paymentData?.arrivalLunch + paymentData?.accommodation + paymentData?.food)/100}/-</td>
                            </tr>
                    </tbody>
                </table>
                <div className="mb-8 mt-4">
                    <label className="block text-xl font-semibold text-teal-800">Total Contributions: {paymentData?.totalCharges}</label>
                </div>
            </div>
            <input type="hidden" name="key" value={paymentData?.key} />
            <input type="hidden" name="txnid" value={paymentData?.txnid} />
            <input type="hidden" name="productinfo" value={paymentData?.productinfo} />
            <input type="hidden" name="amount" value={paymentData?.totalCharges} />
            <input type="hidden" name="email" value={paymentData?.email} />
            <input type="hidden" name="firstname" value={paymentData?.firstname} />
            <input type="hidden" name="surl" value={paymentData?.surl} />
            <input type="hidden" name="furl" value={paymentData?.furl}/>
            <input type="hidden" name="phone" value={paymentData?.phone} />
            <input type="hidden" name="hash" value={paymentData?.hash}/>
            <input type="submit" value="submit" />
        </form>
    )
}

export type { PaymentData };