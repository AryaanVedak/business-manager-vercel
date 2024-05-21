import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface Invoice {
  bill_no: KeyFormat;
  date: Date;
  product_name: string;
  amount: String;
  gst_percentage: String;
  gst_amount: String;
  total_amount: String;
  paid_date: Date;
  remark: String;
  person: String;
  invoice: String;
}

async function getData() {
  const res = await fetch('http://https://business-manager-vercel.vercel.app/api/get-bills')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export function DashTable() {

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedInvoices = await getData();
        // console.log(fetchedInvoices.bills)
        setInvoices(fetchedInvoices.bills);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        // Handle the error appropriately (e.g., set an error state)
      }
    };

    fetchData();

    // Cleanup function (optional):
    // return () => {
    //   // Any cleanup logic here (e.g., cancelling subscriptions)
    // };
  }, []);

  useEffect(() => {
    console.log(invoices)

    // const formatedDate = invoices.date

  },[invoices])

  return (
    <>
      <div className="text-3xl font-bold tracking-tight mb-4 pt-4">DashBoard</div>
      <div className="rounded-md border">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Bill No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">GST%</TableHead>
              <TableHead className="text-right">GST Amount</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead>Person</TableHead>
              <TableHead>Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.bill_no}> 
                <TableCell className="font-medium">{invoice.bill_no}</TableCell>
                <TableCell className="font-medium">{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>{invoice.product_name}</TableCell>
                <TableCell className="text-right">{invoice.amount}</TableCell>
                <TableCell className="text-right">{invoice.gst_percentage}%</TableCell>
                <TableCell className="text-right">{invoice.gst_amount}</TableCell>
                <TableCell className="text-right">{invoice.total_amount}</TableCell>
                <TableCell>{new Date(invoice.paid_date).toLocaleDateString()}</TableCell>
                <TableCell>{invoice.remark}</TableCell>
                <TableCell>{invoice.person}</TableCell>
                <TableCell>Download</TableCell>
            </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
