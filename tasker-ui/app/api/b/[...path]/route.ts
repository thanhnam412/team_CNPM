import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const NESTJS_API_URL = process.env.NESTJS_API_URL!;

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const requestedWith = req.headers.get("x-requested-with");
  if (requestedWith !== "XMLHttpRequest") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const session = await auth();

  if (!session || session.error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  const pathname = path.join("/");

  const search = req.nextUrl.search;

  const url = `${NESTJS_API_URL}/${pathname}${search}`;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("Authorization", `Bearer ${session.accessToken}`);

  requestHeaders.delete("host");
  console.log(url);

  const res = await fetch(url, {
    method: req.method,
    headers: requestHeaders,
    body:
      req.method !== "GET" && req.method !== "DELETE"
        ? await req.blob()
        : undefined,
  });

  const responseHeaders = new Headers(res.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(res.body, {
    status: res.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
