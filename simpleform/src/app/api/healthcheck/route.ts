import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
        return new NextResponse(JSON.stringify({ message: 'Server is up and running' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
        });
}
