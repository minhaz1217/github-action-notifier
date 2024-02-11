import { NextRequest, NextResponse } from "next/server";

// http://localhost:3000/api/health?key=Minhaz
export async function GET(request: NextRequest, response: NextResponse) {
  //   console.debug("Req", JSON.stringify(request));
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    console.debug('Key', key);
    return NextResponse.json("Healthy");
  }
  