import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM ?? 'orders@varcha.in';

interface OrderEmailData {
  to: string;
  name: string;
  orderId: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  shippingAddress: { line1: string; line2?: string; city: string; state: string; pincode: string };
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemRows = data.items
    .map((i) => `<tr><td>${i.name}</td><td>×${i.qty}</td><td>₹${i.price.toLocaleString('en-IN')}</td></tr>`)
    .join('');

  const html = `
    <h2>Order confirmed — Varcha</h2>
    <p>Hi ${data.name}, thank you for your order!</p>
    <p><strong>Order ID:</strong> ${data.orderId}</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <p><strong>Total: ₹${data.totalAmount.toLocaleString('en-IN')}</strong></p>
    <p><strong>Shipping to:</strong><br>
      ${data.shippingAddress.line1}${data.shippingAddress.line2 ? ', ' + data.shippingAddress.line2 : ''}<br>
      ${data.shippingAddress.city}, ${data.shippingAddress.state} — ${data.shippingAddress.pincode}
    </p>
    <p>We'll notify you once your order ships.</p>
    <p>— Varcha team</p>
  `;

  if (!resend) {
    console.log('[emailService] No RESEND_API_KEY set — would have sent:', { to: data.to, orderId: data.orderId });
    return;
  }

  try {
    await resend.emails.send({ from: FROM, to: data.to, subject: `Order confirmed — Varcha #${data.orderId.slice(-8)}`, html });
  } catch (err) {
    // Email failure must never break the order flow — log and continue
    console.error('[emailService] Failed to send confirmation email:', err);
  }
}
