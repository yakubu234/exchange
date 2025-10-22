import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, CheckCircle } from "lucide-react";

export interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  county: string;
  postcode: string;
  comments?: string;
  price: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "approved";
  receiptUrl?: string;
  createdAt: string;
}

interface PrintableBookingReceiptProps {
  booking: Booking;
}

const PrintableBookingReceipt = ({ booking }: PrintableBookingReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking Receipt ${booking.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              background: white;
            }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              position: relative;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 120px;
              font-weight: 900;
              color: rgba(212, 175, 55, 0.08);
              z-index: 0;
              pointer-events: none;
              text-transform: uppercase;
              letter-spacing: 10px;
            }
            .content {
              position: relative;
              z-index: 1;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #d4af37;
            }
            .company-name {
              font-size: 32px;
              font-weight: 900;
              color: #1a1a1a;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            .receipt-title {
              font-size: 18px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .booking-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 40px;
            }
            .detail-section h3 {
              font-size: 14px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 12px;
              font-weight: 600;
            }
            .detail-section p {
              color: #1a1a1a;
              line-height: 1.8;
              margin: 4px 0;
            }
            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 16px;
              background: #dcfce7;
              color: #15803d;
              border-radius: 20px;
              font-weight: 600;
              font-size: 14px;
            }
            .service-card {
              background: #f9fafb;
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 30px;
            }
            .service-name {
              font-size: 24px;
              font-weight: 700;
              color: #1a1a1a;
              margin-bottom: 10px;
            }
            .service-price {
              font-size: 32px;
              font-weight: 900;
              color: #d4af37;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              padding-top: 30px;
              border-top: 2px solid #e5e7eb;
              color: #666;
              font-size: 13px;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Print Button */}
        {(booking.paymentStatus === "paid" || booking.paymentStatus === "approved") && (
          <div className="p-4 bg-muted/30 border-b no-print">
            <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        )}

        {/* Receipt Content */}
        <div ref={receiptRef} className="p-8">
          {/* Watermark */}
          {(booking.paymentStatus === "paid" || booking.paymentStatus === "approved") && (
            <div className="watermark">PAID</div>
          )}

          <div className="content">
            {/* Header */}
            <div className="header">
              <h1 className="company-name">GLOW BEAUTY EMPORIUM</h1>
              <p className="receipt-title">Booking Receipt</p>
            </div>

            {/* Service Card */}
            <div className="service-card">
              <div className="service-name">{booking.service}</div>
              <div className="service-price">£{booking.price}</div>
            </div>

            {/* Booking Details */}
            <div className="booking-details">
              <div className="detail-section">
                <h3>Booking Information</h3>
                <p><strong>Booking ID:</strong> {booking.id}</p>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Payment Method:</strong> {booking.paymentMethod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <div style={{ marginTop: '12px' }}>
                  {(booking.paymentStatus === "paid" || booking.paymentStatus === "approved") && (
                    <span className="status-badge">
                      <CheckCircle style={{ width: '16px', height: '16px' }} />
                      Payment Received
                    </span>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Customer Details</h3>
                <p><strong>{booking.fullName}</strong></p>
                <p>{booking.address}</p>
                <p>{booking.county}, {booking.postcode}</p>
                <p style={{ marginTop: '8px' }}><strong>Phone:</strong> {booking.phone}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                {booking.comments && (
                  <p style={{ marginTop: '8px' }}><strong>Comments:</strong> {booking.comments}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <p><strong>Thank you for choosing Glow Beauty Emporium!</strong></p>
              <p style={{ marginTop: '8px' }}>For any questions, please contact us at enquiries@glowbeautyemporium.com</p>
              <p>+44 7886 221372</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintableBookingReceipt;
