import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email, name, role } = body;

        if (!email || !name || !role) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const user = { email, name, role };

        // Create JWT
        const token = jwt.sign(user, SECRET_KEY, {
            expiresIn: "24h",
        });

        const response = NextResponse.json({
            message: "Login successful",
        });

        // Set cookie
        response.cookies.set("user_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 60,
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}