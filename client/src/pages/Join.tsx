import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useState, useEffect } from "react";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

const joinFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().min(6, "Valid 6-digit Pincode is required").max(6),
  city: z.string().min(1, "City is required"),
  fullAddress: z.string().min(5, "Full address is required"),
  mpin: z.string().min(4, "MPIN must be 4 digits").max(4),
  confirmMpin: z.string().min(4, "Confirm MPIN is required").max(4),
  referralCode: z.string().optional(),
}).refine((data) => data.mpin === data.confirmMpin, {
  message: "MPINs do not match",
  path: ["confirmMpin"],
});

export default function JoinPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof joinFormSchema>>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      name: "", phone: "", email: "", state: "", pinCode: "",
      city: "", fullAddress: "", mpin: "", confirmMpin: "", referralCode: "",
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('referral');
    if (referralCode) {
      form.setValue('referralCode', referralCode);
      toast({ title: "Referral Code Applied!", description: `You're joining through referral code: ${referralCode}` });
    }
  }, []);

  async function onSubmit(values: z.infer<typeof joinFormSchema>) {
    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/register-mpin', {
        name: values.name,
        phone: values.phone,
        city: values.city,
        pincode: values.pinCode,
        state: values.state,
        role: "solarMitra",
        mpin: values.mpin,
        referred_by: values.referralCode || undefined,
      });
      toast({ title: "Application Submitted Successfully!", description: "Our team will contact you shortly to discuss the next steps." });
      form.reset();
    } catch (error: any) {
      console.error('Join form submission error:', error);
      toast({ title: "Submission Failed", description: error.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24 container mx-auto px-4 max-w-2xl">
        <Card className="border-none shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join KwikM Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Register As</label>
                  <Input value="Become a Solar Mitra" readOnly className="bg-muted cursor-default" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Enter your name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="10-digit number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                        <SelectContent>{states.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="pinCode" render={({ field }) => (
                    <FormItem><FormLabel>Pin Code</FormLabel><FormControl><Input placeholder="6-digit PIN" {...field} maxLength={6} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Enter city" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fullAddress" render={({ field }) => (
                  <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="House/Shop No., Street, Area" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="mpin" render={({ field }) => (
                    <FormItem><FormLabel>Set MPIN</FormLabel><FormControl><Input type="password" placeholder="4-digit MPIN" {...field} maxLength={4} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="confirmMpin" render={({ field }) => (
                    <FormItem><FormLabel>Confirm MPIN</FormLabel><FormControl><Input type="password" placeholder="Re-enter MPIN" {...field} maxLength={4} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="referralCode" render={({ field }) => (
                  <FormItem><FormLabel>Referral Code (Optional)</FormLabel><FormControl><Input placeholder="Enter referral code if you have one" {...field} className="font-mono" /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary h-12 text-lg font-bold" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Download our Android App</p>
                  <a href="https://play.google.com/store/apps/details?id=com.kwizarinfotech.app" target="_blank" rel="noopener noreferrer" className="inline-block">
                    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-14 mx-auto" />
                  </a>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
