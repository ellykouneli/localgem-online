import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  return NextResponse.next();
}
