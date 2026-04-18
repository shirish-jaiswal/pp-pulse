import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("user_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "No token found" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        return NextResponse.json({
            user: decoded,
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 }
        );
    }
}