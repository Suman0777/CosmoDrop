import { NextResponse } from 'next/server'

export function GET() {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return NextResponse.json({ message: randomNumber })
}
