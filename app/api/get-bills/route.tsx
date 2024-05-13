import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bills = await sql `SELECT * FROM billing;`
    console.log(bills)
    return NextResponse.json({bills: bills.rows}, {status: 200})
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}