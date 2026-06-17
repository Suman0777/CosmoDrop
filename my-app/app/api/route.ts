import { NextResponse } from "next/server";

export async function POST() {
  const code = Math.floor(10000 + Math.random() * 90000).toString();
  return NextResponse.json({ code });
}
