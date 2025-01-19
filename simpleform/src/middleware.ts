import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'
export async function middleware(req: NextRequest) {
    const startTime = Date.now(); // Capture start time
    const path = req.nextUrl.pathname; // Get the requested path

    console.log(`Request received: Path=${path}, Method=${req.method}, StartTime=${new Date(startTime).toISOString()}`);

    const response = NextResponse.next();

    response.headers.set('X-Request-Start', startTime.toString());
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(
        `Request processed: Path=${path}, Status=${response.status}, Duration=${duration}ms, EndTime=${new Date(
            endTime
        ).toISOString()}`
    );

    return response;
}

export const config = {
    matcher: ['/api/:path*'],
    runtime: 'nodejs',
};
