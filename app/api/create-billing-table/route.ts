import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET() {
  try {
    const result = await sql`CREATE TABLE IF NOT EXISTS Invoices (
      Bill_No SERIAL PRIMARY KEY,
      Date DATE,
      Product_Name VARCHAR(255),
      Amount NUMERIC,
      GST_Percentage NUMERIC,
      GST_Amount NUMERIC,
      Total_Amount NUMERIC,
      Paid_Date DATE,
      Remark VARCHAR(255),
      Person VARCHAR(255),
      Invoice TEXT
  );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}