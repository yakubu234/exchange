import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ShoppingBag, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Order } from "./Checkout";
import PrintableInvoice from "@/components/PrintableInvoice";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleUploadReceipt = (orderId: string) => {
    if (!receiptFile) {
      toast({
        title: "No File Selected",
        description: "Please select a receipt file to upload",
        variant: "destructive",
      });
      return;
    }

    // Update order with receipt
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          receiptUrl: URL.createObjectURL(receiptFile),
          paymentStatus: "pending" as const,
        };
      }
      return order;
    });

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    setReceiptFile(null);
    setUploadingOrderId(null);

    toast({
      title: "Receipt Uploaded",
      description: "Your payment receipt has been submitted for verification",
    });
  };

  const getStatusBadge = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending Verification
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders. Start shopping to see your order history here.
            </p>
            <Button onClick={() => navigate("/shop-products")}>
              Start Shopping
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">My Orders</h1>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="space-y-4">
                {/* Order Summary Card */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(order.paymentStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Items:</h4>
                      {order.items.map((item) => (
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

                    {/* Total */}
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>£{order.total.toFixed(2)}</span>
                    </div>

                    {/* Delivery Address */}
                    <div className="text-sm">
                      <h4 className="font-semibold mb-1">Delivery Address:</h4>
                      <p className="text-muted-foreground">
                        {order.customerInfo.fullName}<br />
                        {order.customerInfo.address}<br />
                        {order.customerInfo.city}, {order.customerInfo.postcode}<br />
                        {order.customerInfo.phone}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div className="text-sm">
                      <h4 className="font-semibold mb-1">Payment Method:</h4>
                      <p className="text-muted-foreground capitalize">
                        {order.paymentMethod.replace("-", " ")}
                      </p>
                    </div>

                    {/* Upload Receipt for Bank Transfer */}
                    {order.paymentMethod === "bank-transfer" && order.paymentStatus === "pending" && (
                      <div className="mt-4 p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg space-y-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">Payment Pending</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {order.receiptUrl 
                                ? "Your receipt has been submitted and is awaiting admin approval"
                                : "Upload your bank transfer receipt to proceed with verification"}
                            </p>
                          </div>
                        </div>

                        {!order.receiptUrl && (
                          <>
                            {uploadingOrderId === order.id ? (
                              <div className="space-y-3">
                                <Label htmlFor={`receipt-${order.id}`}>Upload Payment Receipt</Label>
                                <Input
                                  id={`receipt-${order.id}`}
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handleFileChange}
                                  className="cursor-pointer"
                                />
                                {receiptFile && (
                                  <p className="text-xs text-muted-foreground">
                                    Selected: {receiptFile.name}
                                  </p>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleUploadReceipt(order.id)}
                                    disabled={!receiptFile}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Submit Receipt
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setUploadingOrderId(null);
                                      setReceiptFile(null);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setUploadingOrderId(order.id)}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Receipt
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Printable Invoice - Only shown for paid/approved orders */}
                {(order.paymentStatus === "paid" || order.paymentStatus === "approved") && (
                  <PrintableInvoice order={order} />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
