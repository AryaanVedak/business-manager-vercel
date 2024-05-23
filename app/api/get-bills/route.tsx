import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic';
export const revalidate = 0

export async function GET() {
  try {
    // Perform the SQL query
    const bills = await sql`SELECT * FROM Invoices;`;

    // Log the retrieved rows for debugging
    console.log('Retrieved bills:', bills.rows);

    // Return the retrieved data as JSON response
    return NextResponse.json({ bills: bills.rows }, { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching bills:', error);

    // Return an error response
    return NextResponse.json({ error: 'Failed to fetch data!' }, { status: 500 });
  }
}
