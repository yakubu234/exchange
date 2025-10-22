import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ShoppingBag, Calendar, Mail, ExternalLink, User, Package, CreditCard, Upload, Printer } from "lucide-react";
import { toast } from "sonner";
import PrintableBookingReceipt from "@/components/PrintableBookingReceipt";

const BOOKINGS_PER_PAGE = 5;
const ORDERS_PER_PAGE = 5;

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders] = useState(() => JSON.parse(localStorage.getItem("orders") || "[]"));
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem("bookings") || "[]"));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleUploadReceipt = (bookingId) => {
    if (!receiptFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const updatedBookings = bookings.map((b) =>
      b.id === bookingId 
        ? { ...b, receiptUrl: URL.createObjectURL(receiptFile), paymentStatus: "pending" }
        : b
    );
    
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    
    toast.success("Receipt uploaded successfully! Your payment will be verified shortly.");
    setReceiptFile(null);
  };

  // Pagination calculations
  const totalBookingsPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);
  const totalOrdersPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedBookings = bookings.slice(
    (bookingsPage - 1) * BOOKINGS_PER_PAGE,
    bookingsPage * BOOKINGS_PER_PAGE
  );
  const paginatedOrders = orders.slice(
    (ordersPage - 1) * ORDERS_PER_PAGE,
    ordersPage * ORDERS_PER_PAGE
  );

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders">Purchase History</TabsTrigger>
            <TabsTrigger value="bookings">Booking History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No purchases yet</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {paginatedOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Order {order.id}</span>
                        <Badge variant={order.paymentStatus === "paid" || order.paymentStatus === "approved" ? "default" : "secondary"}>
                          {order.paymentStatus}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.name} x {item.quantity}</span>
                            <span>£{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 font-bold flex justify-between">
                          <span>Total</span>
                          <span>£{order.total.toFixed(2)}</span>
                        </div>
                        <Button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDialog(true);
                          }}
                          variant="outline"
                          className="w-full mt-4"
                          size="sm"
                        >
                          View Receipt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Orders Pagination */}
                {totalOrdersPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                          className={ordersPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalOrdersPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setOrdersPage(page)}
                            isActive={ordersPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setOrdersPage(p => Math.min(totalOrdersPages, p + 1))}
                          className={ordersPage === totalOrdersPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {paginatedBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{booking.service}</CardTitle>
                          <CardDescription>
                            {new Date(booking.date).toLocaleDateString('en-GB')} at {booking.time}
                          </CardDescription>
                        </div>
                        <Badge variant={booking.paymentStatus === "paid" || booking.paymentStatus === "approved" ? "default" : "secondary"}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <p><strong>Booking ID:</strong> {booking.id}</p>
                      <p><strong>Price:</strong> £{booking.price}</p>
                      <p><strong>Name:</strong> {booking.fullName}</p>
                      <p><strong>Email:</strong> {booking.email}</p>
                      <p><strong>Phone:</strong> {booking.phone}</p>
                    </div>

                    {booking.paymentMethod === "bank-transfer" && booking.paymentStatus === "pending" && !booking.receiptUrl && (
                      <div className="space-y-2 pt-2 border-t">
                        <Label htmlFor={`receipt-${booking.id}`}>Upload Payment Receipt</Label>
                        <Input
                          id={`receipt-${booking.id}`}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        <Button 
                          onClick={() => handleUploadReceipt(booking.id)}
                          size="sm"
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Receipt
                        </Button>
                      </div>
                    )}

                    <Button 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowBookingDialog(true);
                      }}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Bookings Pagination */}
              {totalBookingsPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setBookingsPage(p => Math.max(1, p - 1))}
                        className={bookingsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalBookingsPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setBookingsPage(page)}
                          isActive={bookingsPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setBookingsPage(p => Math.min(totalBookingsPages, p + 1))}
                        className={bookingsPage === totalBookingsPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Order Details Dialog with Receipt */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Your Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedOrder.fullName || selectedOrder.customerInfo?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.email || selectedOrder.customerInfo?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.phone || selectedOrder.customerInfo?.phone}</p>
                  </div>
                  {selectedOrder.customerInfo?.address && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Delivery Address</p>
                      <p className="font-medium">
                        {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.postcode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">₦{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Information
                </h3>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">
                    {selectedOrder.paymentMethod?.replace("-", " ") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Status</p>
                  <Badge 
                    variant={selectedOrder.paymentStatus === 'paid' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Receipt Actions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Your Receipt</h3>
                <p className="text-sm text-muted-foreground">
                  Download or share your official receipt
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      const customerEmail = selectedOrder.customerInfo?.email || selectedOrder.email;
                      const subject = `Your Receipt - Order ${selectedOrder.id}`;
                      const body = `Dear ${selectedOrder.customerInfo?.fullName || selectedOrder.fullName},\n\nThank you for your order ${selectedOrder.id}.\n\nOrder Details:\nTotal: ₦${selectedOrder.total.toLocaleString()}\nStatus: ${selectedOrder.paymentStatus}\nDate: ${new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")}\n\nItems:\n${selectedOrder.items?.map((item) => `- ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`).join("\n")}\n\nIf you have any questions, please contact us.\n\nBest regards,\nGlow Beauty Emporium`;
                      
                      window.location.href = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      toast.info("Opening email client with receipt details...");
                    }}
                    size="sm"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Receipt
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const receiptWindow = window.open("", "_blank");
                      if (!receiptWindow) return;
                      
                      receiptWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Receipt - ${selectedOrder.id}</title>
                            <style>
                              * { margin: 0; padding: 0; box-sizing: border-box; }
                              body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
                              .receipt { max-width: 800px; margin: 0 auto; background: white; padding: 60px; box-shadow: 0 0 20px rgba(0,0,0,0.1); position: relative; }
                              .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); text-align: center; opacity: 0.08; pointer-events: none; }
                              .watermark-logo { width: 200px; height: 200px; margin: 0 auto 20px; }
                              .watermark-text { font-size: 32px; font-weight: 900; color: #000; margin-bottom: 15px; white-space: nowrap; }
                              .watermark-id { font-size: 24px; font-weight: 700; color: #000; }
                              .header { text-align: center; border-bottom: 3px solid #d4af37; padding-bottom: 20px; margin-bottom: 40px; }
                              .company-logo { width: 100px; height: 100px; margin: 0 auto 15px; }
                              .company-name { font-size: 36px; font-weight: 900; margin-bottom: 10px; color: #000; }
                              .receipt-title { font-size: 18px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
                              .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                              .detail-section h3 { font-size: 14px; color: #666; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px; }
                              .detail-section p { margin: 8px 0; line-height: 1.6; }
                              table { width: 100%; border-collapse: collapse; margin: 30px 0; }
                              thead { background: #f5f5f5; border-top: 2px solid #ddd; border-bottom: 2px solid #ddd; }
                              th { padding: 15px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                              th:last-child, td:last-child { text-align: right; }
                              td { padding: 15px; border-bottom: 1px solid #eee; }
                              .totals { margin: 30px 0; border-top: 2px solid #d4af37; padding-top: 20px; }
                              .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 18px; font-weight: bold; }
                              .status-badge { display: inline-block; padding: 10px 20px; border-radius: 30px; font-weight: 600; margin: 20px 0; font-size: 16px; }
                              .status-paid { background: #d4edda; color: #155724; }
                              .status-pending { background: #fff3cd; color: #856404; }
                              .footer { text-align: center; margin-top: 60px; padding-top: 30px; border-top: 2px solid #eee; color: #666; font-size: 14px; }
                              @media print { body { background: white; padding: 0; } .receipt { box-shadow: none; } }
                            </style>
                          </head>
                          <body>
                            <div class="receipt">
                              <div class="watermark">
                                <img src="/src/assets/logo.png" alt="Logo" class="watermark-logo" />
                                <div class="watermark-text">GLOW BEAUTY EMPORIUM</div>
                                <div class="watermark-id">Receipt #${selectedOrder.id}</div>
                              </div>
                              <div class="header">
                                <img src="/src/assets/logo.png" alt="Glow Beauty Emporium" class="company-logo" />
                                <div class="company-name">GLOW BEAUTY EMPORIUM</div>
                                <div class="receipt-title">Official Receipt</div>
                              </div>
                              <div class="details-grid">
                                <div class="detail-section">
                                  <h3>Receipt Details</h3>
                                  <p><strong>Receipt No:</strong> ${selectedOrder.id}</p>
                                  <p><strong>Date:</strong> ${new Date(selectedOrder.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
                                  <p><strong>Payment Method:</strong> ${selectedOrder.paymentMethod?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"}</p>
                                </div>
                                <div class="detail-section">
                                  <h3>Customer</h3>
                                  <p><strong>${selectedOrder.customerInfo?.fullName || selectedOrder.fullName}</strong></p>
                                  <p>${selectedOrder.customerInfo?.email || selectedOrder.email}</p>
                                  <p>${selectedOrder.customerInfo?.phone || selectedOrder.phone}</p>
                                </div>
                              </div>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${selectedOrder.items?.map((item) => `
                                    <tr>
                                      <td>${item.name}</td>
                                      <td>${item.quantity}</td>
                                      <td>₦${item.price.toLocaleString()}</td>
                                      <td>₦${(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                  `).join("")}
                                </tbody>
                              </table>
                              <div class="totals">
                                <div class="total-row">
                                  <span>Total Amount</span>
                                  <span>₦${selectedOrder.total.toLocaleString()}</span>
                                </div>
                              </div>
                              <div style="text-align: center;">
                                <span class="status-badge ${selectedOrder.paymentStatus === "paid" || selectedOrder.paymentStatus === "approved" || selectedOrder.paymentStatus === "completed" ? "status-paid" : "status-pending"}">
                                  ${selectedOrder.paymentStatus === "paid" || selectedOrder.paymentStatus === "approved" || selectedOrder.paymentStatus === "completed" ? "✓ PAID" : "⏱ PENDING"}
                                </span>
                              </div>
                              <div class="footer">
                                <p><strong>Thank you for your business!</strong></p>
                                <p>Glow Beauty Emporium | For questions, please contact us at support@glowbeautyemporium.com</p>
                              </div>
                            </div>
                          </body>
                        </html>
                      `);
                      receiptWindow.document.close();
                      toast.success("Receipt opened in new window. You can print or save as PDF!");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View/Print Receipt
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog with Receipt */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking {selectedBooking?.id}
            </DialogTitle>
            <DialogDescription>
              Scheduled for {selectedBooking && new Date(selectedBooking.date).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric'
              })} at {selectedBooking?.time}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Service Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{selectedBooking.service}</h3>
                <p className="text-3xl font-bold text-primary">£{selectedBooking.price}</p>
              </div>

              <Separator />

              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Your Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedBooking.fullName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {selectedBooking.address}, {selectedBooking.county}, {selectedBooking.postcode}
                    </p>
                  </div>
                  {selectedBooking.comments && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Comments</p>
                      <p className="font-medium">{selectedBooking.comments}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Information
                </h3>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">
                    {selectedBooking.paymentMethod?.replace("-", " ") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Status</p>
                  <Badge 
                    variant={selectedBooking.paymentStatus === 'paid' || selectedBooking.paymentStatus === 'approved' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {selectedBooking.paymentStatus}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Receipt Section */}
              {(selectedBooking.paymentStatus === "paid" || selectedBooking.paymentStatus === "approved") && (
                <div className="space-y-3">
                  <PrintableBookingReceipt booking={selectedBooking} />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
