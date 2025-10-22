import { useState, useEffect } from "react";
import { getBookingServices } from "@/components/ServicesAdmin";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CreditCard, Upload, Building2 } from "lucide-react";

const bookingSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(20, "Phone number must be less than 20 characters"),
  address: z.string().trim().min(5, "Please enter your address").max(200, "Address must be less than 200 characters"),
  county: z.string().optional(),
  postcode: z.string().trim().min(5, "Please enter your postcode").max(10, "Postcode must be less than 10 characters"),
  comments: z.string().optional(),
});

const BookingPage = () => {
  const { service } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [bookingId] = useState(`BKG-${Math.random().toString(36).substr(2, 5).toUpperCase()}`);

  useEffect(() => {
    const services = getBookingServices();
    const currentService = services.find(s => s.id === service);
    if (currentService) {
      setServiceName(currentService.title);
      setServicePrice(currentService.price);
    }
  }, [service]);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      county: "",
      postcode: "",
      comments: "",
    },
  });

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleBooking = (data: z.infer<typeof bookingSchema>) => {
    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }

    // Create booking object
    const booking = {
      id: bookingId,
      service: serviceName,
      serviceId: service,
      date: date.toISOString(),
      time,
      ...data,
      price: servicePrice,
      paymentMethod,
      paymentStatus: paymentMethod === "bank-transfer" ? "pending" : "paid",
      receiptUrl: receiptFile ? URL.createObjectURL(receiptFile) : undefined,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([...existingBookings, booking]));

    const statusMessage = paymentMethod === "bank-transfer" 
      ? "Your booking has been placed and is pending payment verification. You can upload your payment receipt from your dashboard."
      : "Your booking is confirmed! You will receive a confirmation email shortly.";

    toast.success(statusMessage);
    form.reset();
    setDate(undefined);
    setTime("");
    setReceiptFile(null);
    
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Book {serviceName}
          </h1>
          {servicePrice > 0 && (
            <p className="text-3xl font-bold text-primary mb-2">
              £{servicePrice}
            </p>
          )}
          <p className="text-lg text-muted-foreground">
            Select your preferred date and time
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Schedule Your Appointment</CardTitle>
              <CardDescription>Choose a date and time that works best for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border p-3 pointer-events-auto"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Select Time</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={cn(
                        "p-2.5 rounded-lg border-2 text-base font-medium transition-all duration-200",
                        time === slot
                          ? "bg-accent text-white border-accent shadow-lg"
                          : "bg-background border-border hover:border-accent/50 hover:bg-accent/5"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={form.handleSubmit(handleBooking)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      {...form.register("firstName")}
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      {...form.register("lastName")}
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your address"
                    rows={2}
                    {...form.register("address")}
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="county">County (Optional)</Label>
                    <Input
                      id="county"
                      placeholder="Enter your county"
                      {...form.register("county")}
                    />
                    {form.formState.errors.county && (
                      <p className="text-sm text-destructive">{form.formState.errors.county.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postcode">Post Code *</Label>
                    <Input
                      id="postcode"
                      placeholder="Enter your postcode"
                      {...form.register("postcode")}
                    />
                    {form.formState.errors.postcode && (
                      <p className="text-sm text-destructive">{form.formState.errors.postcode.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Any Other Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    placeholder="Any special requests or additional information..."
                    rows={3}
                    {...form.register("comments")}
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer" className="cursor-pointer">Bank Transfer (Recommended)</Label>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="paypal" id="paypal" disabled />
                      <Label htmlFor="paypal" className="cursor-not-allowed">
                        PayPal <span className="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="debit-card" id="debit-card" disabled />
                      <Label htmlFor="debit-card" className="cursor-not-allowed">
                        Debit Card <span className="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "bank-transfer" && (
                    <div className="space-y-4">
                      <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
                        <h4 className="font-semibold text-sm">Your Booking Reference</h4>
                        <p className="text-2xl font-bold text-primary">{bookingId}</p>
                        <p className="text-xs text-muted-foreground">
                          Use this reference when making your bank transfer
                        </p>
                      </div>

                      <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <Building2 className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div className="space-y-2 flex-1">
                            <h4 className="font-semibold">Bank Account Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="text-muted-foreground">Account Name:</span> <span className="font-medium">GLOW BEAUTY EMPORIUM LTD</span></p>
                              <p><span className="text-muted-foreground">Sort Code:</span> <span className="font-medium">04-00-03</span></p>
                              <p><span className="text-muted-foreground">Account Number:</span> <span className="font-medium">20049509</span></p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="receipt">Upload Payment Receipt (Optional)</Label>
                        <Input
                          id="receipt"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        {receiptFile && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Upload className="h-4 w-4" />
                            <span>{receiptFile.name}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          You can upload your receipt now or later from your dashboard
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit"
                    className="w-full h-12 text-lg bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
