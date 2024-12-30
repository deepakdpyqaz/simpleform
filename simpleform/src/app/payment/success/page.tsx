// Successful Registration Page
"use client";
import React from "react";

export default function SuccessfulRegistration() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-200">
            <div className="text-center p-10 bg-white rounded-xl shadow-xl">
                <h1 className="text-4xl font-extrabold text-green-700 mb-4">Registration Successful</h1>
                <p className="text-lg text-gray-700 mb-4">Thank you for registering! We're excited to have you with us.</p>
            </div>
        </div>
    );
}
