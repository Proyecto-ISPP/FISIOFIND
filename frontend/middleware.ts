import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const protectedRoutes = [
//   "/admin-management",
//   "/admin-management/appointments",
//   "/admin-management/terms",
//   "/admin-management/users",
//   "/my-appointments",
//   "/videocalls",
//   "/treatments",
//   "/patient-management/profile",
//   "/physio-management/profile"
// ];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // if (!token && protectedRoutes.includes(request.nextUrl.pathname)) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     "/admin-management/:path*",
//     "/my-appointments/:path*",
//     "/videocalls/:path*",
//     "/treatments/:path*",
//     "/patient-management/profile/:path*",
//     "/physio-management/profile/:path*"
//   ],
// };