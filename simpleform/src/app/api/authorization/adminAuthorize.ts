import { NextRequest } from "next/server";

export const checkAdminAccess = (req: NextRequest): boolean => {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader=== process.env.ADMIN_HEADER) {
        return true;
    }
    return false;
}