"use client"

import axios from 'axios'; 
import { format } from 'date-fns';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const FormSchema = z.object({
  billNo: z.string().min(2, {
    message: "Bill Number Should not be empty",
  }),
  date: z.string().optional(), // Optional date field
  product: z.string(),
  amount: z.number().positive(),
  gst: z.number().positive(),
  gstAmount: z.number(),
  total: z.number(),
  paidDate: z.string().optional(),
  remark: z.string().optional(), 
  person: z.string().optional(),
  invoice: z.any(),
});

export default function AddInvoice() {

  
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [base64String, setBase64String] = useState<string | null>(null);


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      billNo: "",
      gstAmount: 0, // Initialize gstAmount to 0
      total: 0, // Initialize total to 0
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return; // Handle no file selected

    setSelectedFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setBase64String(e.target?.result?.toString() || ''); // Handle potential errors
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  };

  const handleAmountChange = (event: { target: { value: string; }; }) => {
    setValue("amount", parseFloat(event.target.value));
  };

  const handleGstChange = (event: { target: { value: string; }; }) => {
    setValue("gst", parseFloat(event.target.value));
  };

  const {  control, watch, setValue, formState: { errors }  } = form;

  const amount = watch("amount");
  const gstRate = watch("gst");

  // Function to calculate GST amount dynamically
  const calculateGstAmount = () => {
    if (amount && gstRate) {
      const gst = (amount * gstRate) / 100;
      setValue("gstAmount", gst); // Update gstAmount in form state
    } else {
      setValue("gstAmount", 0); // Reset gstAmount to 0 if values missing
    }
  };

  // Function to calculate total dynamically
  const calculateTotal = () => {
    if (amount && watch("gstAmount")) {
      const total = Number(amount) + Number(watch("gstAmount")); // Add amount and gstAmount
      setValue("total", total); // Update total in form state
    } else {
      setValue("total", 0); // Reset total to 0 if values missing
    }
  };

  // Call calculateGstAmount and calculateTotal on relevant field changes
  useEffect(() => {
    calculateGstAmount();
    calculateTotal();
  }, [amount, gstRate]); // Run on change of amount or gstRate


  async function onSubmit(data: z.infer<typeof FormSchema>) {

    if (data.date && data.paidDate) { // Check if data.date is not undefined
      const formattedDate = format(new Date(data.date), 'dd-MM-yyyy');
      const formattedPaidDate = format(new Date(data.paidDate), 'dd-MM-yyyy');

      // Implement form submission logic here (e.g., send data to server)
      const filteredData = {
        Bill_No: data.billNo,
        Date: formattedDate,
        Product_Name: data.product,
        Amount: data.amount,
        GST_Percentage: data.gst,
        GST_Amount: data.gstAmount,
        Total_Amount: data.total,
        Paid_Date: data.paidDate,
        Remark: data.remark,
        Person: data.person,
        Invoice: base64String,
      };
      
      try {
        const response = await axios.post(
          `http://https://business-manager-vercel-iomw1oru0-aryaan-vedaks-projects.vercel.app/api/add-bill?Bill_No=${data.billNo}`, // Replace with your actual API endpoint URL
          filteredData,
          {
            headers: {
              'Content-Type': 'application/json', // Set content type to JSON
            },
          }
        );
        // Check for successful response (e.g., status code 200)
        if (response.status === 200) { // Assuming success code here
          console.log('API response:', response.data);
  
          // Clear form fields on successful submission
          form.reset({
            billNo: '',
            date: '',
            product: '',
            amount: 0, // Reset amount to 0
            gst: 0, // Reset gst to 0
            gstAmount: 0, // Reset gstAmount to 0
            total: 0, // Reset total to 0
            paidDate: '',
            remark: '',
            person: '',
            invoice: null, // Reset invoice to null
          });
          } else {
            console.error('API request failed:', response.status, response.data);
            // Handle API errors here (e.g., display error message)
          }
      } catch (error) {
        console.error('Error submitting invoice:', error);
        // Handle API errors here (e.g., display error message)
      }

    } else {
      // Handle the case where data.date is undefined (e.g., set a default value)
    }

    console.log(data.date)

  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 mt-20 bg-white pb-6">
      <div className="text-3xl font-bold tracking-tight mb-4 pt-4">Invoice</div>
      <div className="rounded-md border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 mt-4 pl-4 pr-4 mb-4">
              {/* Bill No */}
              <FormField
                control={form.control}
                name="billNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill No</FormLabel>
                    <FormControl>
                      <Input placeholder="Bill No" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Product Name */}
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount"
                        {...field}
                        value={watch("amount")}
                        onChange={handleAmountChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* GST */}
              <FormField
                control={form.control}
                name="gst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="GST"
                        {...field}
                        value={watch("gst")}
                        onChange={handleGstChange}

                          
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* GST Amount (calculated dynamically based on amount and GST) */}
              <FormField
                control={form.control}
                name="gstAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="GST Amount" {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Total (calculated dynamically based on amount and GST amount) */}
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Paid Date */}
              <FormField
                control={form.control}
                name="paidDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Remark */}
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remark</FormLabel>
                    <FormControl>
                      <Input placeholder="Remark" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Person */}
              <FormField
                control={form.control}
                name="person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Person" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* File Upload */}
              <FormField control={form.control} 
              name="invoice" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} onChange={handleFileUpload} />
                    {/* {errors.file && <FormMessage>{errors.file.message}</FormMessage>} */}
                  </FormControl>
                </FormItem>
              )} />

              {/* Submit Button */}
              <div className=" flex col-span-2 align-middle justify-center">
                <Button type="submit" className="w-40">Submit</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}