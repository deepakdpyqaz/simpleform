"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function UnsuccessfulRegistration() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-red-200">
            <div className="text-center p-10 bg-white rounded-xl shadow-xl">
                <h1 className="text-4xl font-extrabold text-red-700 mb-4">Registration Unsuccessful</h1>
                <p className="text-lg text-gray-700 mb-4">We're sorry, but there was an issue with your registration. Please try again later.</p>
                <button 
                    onClick={() => router.push("/")} 
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
