import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer, CheckCircle } from "lucide-react";
import { Order } from "@/pages/Checkout";

const PrintableInvoice = ({ order }) => {
  const invoiceRef = useRef(null);

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${order.id}</title>
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
            .invoice-container {
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
              color: rgba(34, 197, 94, 0.08);
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
              border-bottom: 3px solid #22c55e;
            }
            .company-name {
              font-size: 32px;
              font-weight: 900;
              color: #1a1a1a;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            .invoice-title {
              font-size: 18px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .invoice-details {
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
              line-height: 1.6;
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
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .items-table thead {
              background: #f9fafb;
              border-top: 2px solid #e5e7eb;
              border-bottom: 2px solid #e5e7eb;
            }
            .items-table th {
              padding: 12px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666;
              font-weight: 600;
            }
            .items-table th:last-child,
            .items-table td:last-child {
              text-align: right;
            }
            .items-table td {
              padding: 14px 12px;
              border-bottom: 1px solid #f3f4f6;
              color: #1a1a1a;
            }
            .items-table tbody tr:hover {
              background: #fafafa;
            }
            .totals {
              margin-left: auto;
              width: 300px;
              margin-top: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .total-row.grand-total {
              border-top: 2px solid #22c55e;
              border-bottom: 2px solid #22c55e;
              font-size: 18px;
              font-weight: 700;
              color: #1a1a1a;
              margin-top: 10px;
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

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 5;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Print Button */}
        {(order.paymentStatus === "paid" || order.paymentStatus === "approved") && (
          <div className="p-4 bg-muted/30 border-b no-print">
            <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto">
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        )}

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8">
          {/* Watermark */}
          {(order.paymentStatus === "paid" || order.paymentStatus === "approved") && (
            <div className="watermark">PAID</div>
          )}

          <div className="content">
            {/* Header */}
            <div className="header">
              <h1 className="company-name">Premium Store</h1>
              <p className="invoice-title">Invoice</p>
            </div>

            {/* Invoice Details */}
            <div className="invoice-details">
              <div className="detail-section">
                <h3>Invoice Details</h3>
                <p><strong>Invoice Number:</strong> {order.id}</p>
                <p><strong>Invoice Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <div style={{ marginTop: '12px' }}>
                  {(order.paymentStatus === "paid" || order.paymentStatus === "approved") && (
                    <span className="status-badge">
                      <CheckCircle style={{ width: '16px', height: '16px' }} />
                      Payment Received
                    </span>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Bill To</h3>
                <p><strong>{order.customerInfo.fullName}</strong></p>
                <p>{order.customerInfo.address}</p>
                <p>{order.customerInfo.city}, {order.customerInfo.postcode}</p>
                <p style={{ marginTop: '8px' }}><strong>Phone:</strong> {order.customerInfo.phone}</p>
                <p><strong>Email:</strong> {order.customerInfo.email}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.quantity}</td>
                    <td>£{item.price.toFixed(2)}</td>
                    <td>£{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee</span>
                <span>£{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total Amount</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <p><strong>Thank you for your business!</strong></p>
              <p style={{ marginTop: '8px' }}>For any questions regarding this invoice, please contact us.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintableInvoice;
