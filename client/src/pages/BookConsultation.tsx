import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Phone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

export default function BookConsultation() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !name || !email || !phone) {
      toast({
        title: "Please fill all fields",
        description: "Select a date, time, and enter your details.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const consultationData = {
        name,
        email,
        phone,
        preferredDate: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        preferredTime: time,
        message: `Consultation booking request for solar solutions and subsidy guidance.`
      };

      await apiClient.post('/consultations', consultationData);
      
      setIsSubmitted(true);
      toast({
        title: "Consultation Booked Successfully!",
        description: `Your consultation is scheduled for ${date.toLocaleDateString()} at ${time}. We'll call you at ${phone}.`
      });
    } catch (error: any) {
      console.error('Consultation booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallNow = () => {
    window.location.href = "tel:+917080853434";
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Consultation Booked!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you, {name}! Your free consultation is scheduled for{" "}
                <span className="font-bold text-primary">{date?.toLocaleDateString()}</span> at{" "}
                <span className="font-bold text-primary">{time}</span>.
                <br /><br />
                Our solar expert will call you at <span className="font-bold">{phone}</span>.
              </p>
              <Button onClick={() => window.location.href = "/"} className="bg-gradient-to-r from-primary to-secondary">
                Back to Home
              </Button>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Book a <span className="text-primary">Free Consultation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get expert guidance on solar solutions, subsidy benefits, and savings — absolutely free.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Select Date & Time
                  </CardTitle>
                  <CardDescription>Choose your preferred consultation slot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border mx-auto"
                      data-testid="calendar-date"
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Select Time Slot</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger data-testid="select-time">
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {slot}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                  <CardDescription>We'll call you at your scheduled time</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                        data-testid="input-name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        data-testid="input-email"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                        data-testid="input-phone"
                      />
                    </div>

                    {date && time && (
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary">
                          Selected: {date.toLocaleDateString()} at {time}
                        </p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary h-12 text-lg font-bold" 
                      data-testid="button-book"
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {isSubmitting ? "Booking..." : "Book Consultation"}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 text-lg font-bold border-secondary text-secondary hover:bg-secondary hover:text-white"
                      onClick={handleCallNow}
                      data-testid="button-call"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Talk to Expert Now
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
