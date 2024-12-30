"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { AccommodationType, YesNoType } from "../constants";
import { priceList } from "../constants";
interface PaymentData {
    groupSize: number;
    rooms: number;
    extraBed: number;
    accommodationType: AccommodationType | null;
    food: YesNoType | null;
    totalCharges: number;
}
const defaultPaymentData: PaymentData = {
    groupSize: 1,
    rooms: 1,
    extraBed: 0,
    accommodationType: AccommodationType.Room,
    food: YesNoType.Yes,
    totalCharges: 0
}
export default function PaymentComponent() {
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
                    rooms: data.rooms,
                    extraBed: data.extraBed,
                    accommodationType: AccommodationType[data.accommodationType as keyof typeof AccommodationType],
                    food: YesNoType[data.isFoodRequired as keyof typeof YesNoType],
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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return (
            <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-xl p-8 max-w-lg mx-auto border border-teal-300">
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-teal-800">Number of people: {paymentData?.groupSize}</label>
                </div>
                <div className="overflow-x-auto mb-8">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-teal-800 border-b">Ammeneties</th>
                                <th className="px-4 py-2 text-teal-800 border-b">Price per person</th>
                                <th className="px-4 py-2 text-teal-800 border-b">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData?.accommodationType === AccommodationType.Room ?
                                <tr>
                                    <td className="px-4 py-2 border-b">Rooms</td>
                                    <td className="px-4 py-2 border-b">{priceList.perRoom}</td>
                                    <td className="px-4 py-2 border-b">{priceList.perRoom * paymentData?.rooms}</td>
                                </tr> :
                                <tr>
                                    <td className="px-4 py-2 border-b">Dormatory rooms</td>
                                    <td className="px-4 py-2 border-b">{priceList.perDormatory}</td>
                                    <td className="px-4 py-2 border-b">{priceList.perDormatory * paymentData?.groupSize}</td>
                                </tr>
                            }
                            {paymentData.extraBed > 0 ?
                                <tr>
                                    <td className="px-4 py-2 border-b">Rooms with extra bed</td>
                                    <td className="px-4 py-2 border-b">{priceList.extraBedRoom}</td>
                                    <td className="px-4 py-2 border-b">{priceList.extraBedRoom}</td>
                                </tr> : null
                            }
                            {paymentData?.food ?
                                <tr>
                                    <td className="px-4 py-2 border-b">Food</td>
                                    <td className="px-4 py-2 border-b">{priceList.foodFees}</td>
                                    <td className="px-4 py-2 border-b">{priceList.foodFees * paymentData?.groupSize}</td>
                                </tr> : null
                            }
                        </tbody>
                    </table>
                    <div className="mb-8 mt-4">
                        <label className="block text-xl font-semibold text-teal-800">Total charges: {paymentData?.totalCharges}</label>
                    </div>
                </div>
            </form>
    )
}

export type {PaymentData};