import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { Eye, CheckCircle, XCircle, Clock, Upload, Printer, User, CreditCard, Calendar as CalendarIcon } from "lucide-react";
import PrintableBookingReceipt, { Booking } from "@/components/PrintableBookingReceipt";

const ITEMS_PER_PAGE = 10;

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => 
    JSON.parse(localStorage.getItem("bookings") || "[]")
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "paid" | "approved">("all");

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || booking.paymentStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleUpdatePaymentStatus = (bookingId: string, newStatus: "pending" | "paid" | "approved") => {
    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, paymentStatus: newStatus } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    toast.success(`Payment status updated to ${newStatus}`);
    
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, paymentStatus: newStatus });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Unpaid</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by name, ID, or service..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1"
            />
            <Select
              value={filterStatus}
              onValueChange={(value: any) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {paginatedBookings.length} of {filteredBookings.length} bookings
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Booking ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  paginatedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{booking.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{booking.fullName}</div>
                          <div className="text-xs text-muted-foreground">{booking.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{booking.service}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div>{new Date(booking.date).toLocaleDateString('en-GB')}</div>
                          <div className="text-xs text-muted-foreground">{booking.time}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary">
                        £{booking.price}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getStatusBadge(booking.paymentStatus)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Booking Details - {selectedBooking?.id}
            </DialogTitle>
            <DialogDescription>
              Created on {selectedBooking && new Date(selectedBooking.createdAt).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Service Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{selectedBooking.service}</h3>
                <p className="text-3xl font-bold text-primary">£{selectedBooking.price}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(selectedBooking.date).toLocaleDateString('en-GB')} at {selectedBooking.time}</span>
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">
                      {selectedBooking.paymentMethod?.replace("-", " ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <div className="mt-1">
                      {getStatusBadge(selectedBooking.paymentStatus)}
                    </div>
                  </div>
                </div>

                {/* Payment Status Management */}
                <div className="pt-3">
                  <p className="text-sm font-medium mb-2">Update Payment Status:</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedBooking.paymentStatus === "pending" ? "default" : "outline"}
                      onClick={() => handleUpdatePaymentStatus(selectedBooking.id, "pending")}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedBooking.paymentStatus === "approved" ? "default" : "outline"}
                      onClick={() => handleUpdatePaymentStatus(selectedBooking.id, "approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedBooking.paymentStatus === "paid" ? "default" : "outline"}
                      onClick={() => handleUpdatePaymentStatus(selectedBooking.id, "paid")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Paid
                    </Button>
                  </div>
                </div>

                {/* Receipt Upload Display */}
                {selectedBooking.receiptUrl && (
                  <div className="pt-3">
                    <p className="text-sm font-medium mb-2">Uploaded Receipt:</p>
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-primary" />
                        <span className="text-sm">Receipt uploaded by customer</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedBooking.receiptUrl, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Receipt Section */}
              {(selectedBooking.paymentStatus === "paid" || selectedBooking.paymentStatus === "approved") && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Printer className="h-5 w-5 text-primary" />
                    Official Receipt
                  </h3>
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

export default BookingsAdmin;
