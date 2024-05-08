import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const {searchParams} = new URL(request.url)
    const Bill_No = searchParams.get('Bill_No');
    const { Date, Product_Name, Amount, GST_Percentage, GST_Amount, Total_Amount, Paid_Date, Remark, Person, Invoice } = await request.json();
    
    if (!Bill_No || !Date || !Product_Name || !Amount || !GST_Percentage || !GST_Amount || !Total_Amount || !Person || !Invoice) {
      throw new Error('Incomplete fields');
    }

    // Check if a bill with the same Bill_No already exists
    const existingBill = await sql`SELECT * FROM billing WHERE Bill_No = ${Bill_No}`;
    if (existingBill.rows.length > 0) {
      throw new Error('A bill with the same number already exists');
    }

    await sql`INSERT INTO billing (Bill_No, Date, Product_Name, Amount, GST_Percentage, GST_Amount, Total_Amount, Paid_Date, Remark, Person, Invoice) 
                VALUES (${Bill_No}, ${Date}, ${Product_Name}, ${Amount}, ${GST_Percentage}, ${GST_Amount}, ${Total_Amount}, ${Paid_Date}, ${Remark}, ${Person}, ${Invoice});`;
    
    const billingData = await sql`SELECT * FROM billing;`;
    return NextResponse.json({billingData: billingData.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
