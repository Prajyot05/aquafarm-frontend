import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import axios from "axios";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const getUserInfo = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/api/v1/user/admin`,
      { withCredentials: true },
    );

    const { _id: id, username, emailId, phone, role } = response.data.data.user;
    return { id, username, emailId, phone, role };
  } catch (error: any) {
    console.log("Error getting user info:", error.response?.data?.message);
  }
};

export async function middleware(req: NextRequest) {
  // const { setUserInfo, clearUserInfo } = useUserContext();

  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.pathname;
  const isLoginPage = url === "/admin";

  // Exclude static files and API calls
  if (
    url.startsWith("/_next") ||
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
      const userInfo = await getUserInfo();
      if (userInfo) {
        // setUserInfo({...userInfo, token});
      }

      // Redirect logged-in users away from /admin
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } else {
      // clearUserInfo();
      if (!isLoginPage) {
        // No token, redirect to /admin if not already there
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
  } catch (err) {
    // clearUserInfo();
    // Handle token verification failure
    console.error("JWT Verification Error:", err);
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Proceed if no redirection is needed
  return NextResponse.next();
}
