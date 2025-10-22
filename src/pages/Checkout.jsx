import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { ShoppingBag, CreditCard, Building2, Mail, Phone, Upload } from "lucide-react";

const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-${result}`;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");
  const [receiptFile, setReceiptFile] = useState(null);
  const [orderId] = useState(generateOrderId());
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create order
    const order = {
      id: orderId,
      items: cartItems,
      total: getTotalPrice() + 5,
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postcode: formData.postcode,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "bank-transfer" ? "pending" : "paid",
      receiptUrl: receiptFile ? URL.createObjectURL(receiptFile) : undefined,
      createdAt: new Date().toISOString(),
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]));

    const statusMessage = paymentMethod === "bank-transfer" 
      ? "Your order has been placed and is pending payment verification. You can upload your payment receipt from the Orders page."
      : "Thank you for your purchase. You will receive a confirmation email shortly.";

    toast({
      title: "Order Placed Successfully!",
      description: statusMessage,
    });

    clearCart();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checking out
            </p>
            <Button onClick={() => navigate("/shop-products")}>
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary - First */}
            <div className="lg:col-span-1 order-1 lg:order-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          £{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">£{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">£5.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>£{(getTotalPrice() + 5).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form - Second */}
            <div className="lg:col-span-2 order-2 lg:order-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer" className="cursor-pointer">Bank Transfer (Recommended)</Label>
                      </div>
                      <div className="flex items-center space-x-2 opacity-50">
                        <RadioGroupItem value="card" id="card" disabled />
                        <Label htmlFor="card" className="cursor-not-allowed">
                          Credit/Debit Card <span className="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 opacity-50">
                        <RadioGroupItem value="paypal" id="paypal" disabled />
                        <Label htmlFor="paypal" className="cursor-not-allowed">
                          PayPal <span className="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "bank-transfer" && (
                      <div className="space-y-4">
                        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
                          <h4 className="font-semibold text-sm">Your Order Reference</h4>
                          <p className="text-2xl font-bold text-primary">{orderId}</p>
                          <p className="text-xs text-muted-foreground">
                            Use this reference number when making your bank transfer
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

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                          <h4 className="font-semibold text-sm">Payment Instructions</h4>
                          <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                            <li>Transfer the total amount to the bank account above</li>
                            <li>Use your order reference as the payment reference</li>
                            <li>Upload your payment receipt below</li>
                            <li>Your order will be processed once payment is verified</li>
                          </ol>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="receipt">Upload Payment Receipt (Optional)</Label>
                          <div className="flex items-center gap-4">
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
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Accepted formats: JPG, PNG, PDF (Max 5MB)
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="rounded-lg border bg-muted/50 p-4">
                        <p className="text-sm text-muted-foreground">
                          You will be redirected to PayPal to complete your payment securely.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postcode">Postcode *</Label>
                        <Input
                          id="postcode"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      For any issues or questions regarding your order, please contact us:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href="mailto:enquiries@glowbeautyemporium.com" className="hover:underline">
                          enquiries@glowbeautyemporium.com
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href="tel:+447886221372" className="hover:underline">
                          +44 7886 221372
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in hover:scale-105"
                >
                  Place Order
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
