import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import axios from "axios";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const getUserInfo = async (token: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/user/admin`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const {_id: id, username, emailId, phone, role} = response.data.data.user;
        return {id, username, emailId, phone, role};
    } catch (error) {
        console.log('Error getting user info:', error);
    }
}

let userInfo: any = null;

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const url = req.nextUrl.pathname;
    const isLoginPage = url === "/admin";

    // Exclude static files and API calls
    if (
        url.startsWith('/_next') || 
        /\.(.*)$/.test(url) || 
        url.startsWith(process.env.NEXT_PUBLIC_SERVER || "")
    ) {
        return NextResponse.next();
    }

    try {
        if (token) {
            // Verify the token using jose
            const { payload } = await jwtVerify(token, JWT_SECRET);
            // console.log("Token verified successfully:", payload);

            // Get user info from the server
            if(!userInfo) userInfo = await getUserInfo(token);
            // console.log('USER INFO:', userInfo);

            // Redirect logged-in users away from /admin
            if (isLoginPage) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        } else {
            userInfo = null;
            if (!isLoginPage){
                // No token, redirect to /admin if not already there
                return NextResponse.redirect(new URL("/admin", req.url));
            }
        }
    } catch (err) {
        // Handle token verification failure
        console.error("JWT Verification Error:", err);
        userInfo = null;
        if (!isLoginPage) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    // Proceed if no redirection is needed
    return NextResponse.next();
}