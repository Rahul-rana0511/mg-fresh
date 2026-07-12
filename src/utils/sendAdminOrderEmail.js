import transporter from "./mailer.js";

const sendAdminOrderEmail = async ({ order, cart, user, adminEmail = "rhul@yopmail.com" }) => {
  try {
    const customerName = user?.first_name || user?.email || "Customer";
    const customerPhone = user?.phone_number || "N/A";
    const customerEmail = user?.email || "N/A";
    const orderId = order?.orderId || order?._id || "-";
    const orderDate = new Date().toLocaleString();
    const paymentMethod = order?.paymentMethod || "-";
    const totalAmount = order?.totalAmount ?? order?.amount ?? 0;

   const address = cart?.selectedAddress?.address_details || "N/A";

    // Build product list HTML with product IDs
    const productRows = [];

    if (cart?.individualProducts && cart.individualProducts.length) {
      for (const item of cart.individualProducts) {
        const name = item.productId?.product_name || "Product";
        const price = item.productId?.product_price ?? 0;
        const qty = item.quantity || 0;
        productRows.push(`
          <tr>
           
            <td style="padding:8px 12px;border:1px solid #e6efe6;">${name}</td>
            <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:center;">${qty}</td>
            <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:right;">₹${price}</td>
            <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:right;">₹${price * qty}</td>
          </tr>
        `);
      }
    }

    if (cart?.baskets && cart.baskets.length) {
      for (const basket of cart.baskets) {
        const multiplier = basket.quantity || 1;
        // If basket has fixed price, show basket row only
        if (basket?.basketId?.basket_price && basket.basketId.basket_price > 1) {
          const basketName = basket.basketId?.product_name || "Basket";
          const unit = basket.basketId.basket_price;
          const total = unit * multiplier;
          productRows.push(`
            <tr>

              <td style="padding:8px 12px;border:1px solid #e6efe6;">${basketName}</td>
              <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:center;">${multiplier}</td>
              <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:right;">₹${unit}</td>
              <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:right;">₹${total}</td>
            </tr>
          `);
          // optionally list included items (names only)
          if (basket.products && basket.products.length) {
            productRows.push(`
              <tr>
                <td colspan="5" style="padding:6px 12px;border:1px solid #e6efe6;background:#fbfffb;color:#516651;font-size:13px;">Included: ${basket.products.map(p => p.productId?.product_name || 'Item').join(', ')}</td>
              </tr>
            `);
          }
        } else {
          if (!basket.products || !basket.products.length) continue;
          for (const item of basket.products) {
            const name = item.productId?.product_name || "Product";
            const price = item.productId?.product_price ?? 0;
            const qty = (item.quantity || 0) * multiplier;
            productRows.push(`
              <tr>
                <td style="padding:8px 12px;border:1px solid #e6efe6;">${name} (in ${basket.basketId?.product_name || 'Basket'})</td>
                <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:center;">${qty}</td>
                <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:right;">₹${price}</td>
                <td style="padding:8px 12px;border:1px solid #e6efe6;text-align:right;">₹${price * qty}</td>
              </tr>
            `);
          }
        }
      }
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Order - Admin</title>
</head>
<body style="font-family:Arial,sans-serif;background:#f6faf6;padding:20px;">
  <div style="max-width:800px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e7efe7;">
    <div style="background:#083b20;color:#fff;padding:24px;text-align:center;">
      <h2 style="margin:0;font-size:22px;">New Order Received</h2>
      <p style="margin:8px 0 0;opacity:0.9;">Order ID: <strong>#${orderId}</strong></p>
    </div>
    <div style="padding:20px;">
      <h3 style="margin-top:0;color:#083b20;">Customer Details</h3>
      <p style="margin:6px 0;"><strong>Name:</strong> ${customerName}</p>
      <p style="margin:6px 0;"><strong>Phone:</strong> ${customerPhone}</p>
      <p style="margin:6px 0;"><strong>Email:</strong> ${customerEmail}</p>

      <h3 style="color:#083b20;">Order Summary</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:12px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 12px;border:1px solid #e6efe6;background:#f0fbf0;">Name</th>
            <th style="text-align:center;padding:8px 12px;border:1px solid #e6efe6;background:#f0fbf0;">Qty</th>
            <th style="text-align:right;padding:8px 12px;border:1px solid #e6efe6;background:#f0fbf0;">Unit</th>
            <th style="text-align:right;padding:8px 12px;border:1px solid #e6efe6;background:#f0fbf0;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productRows.join('\n')}
        </tbody>
      </table>

      <p style="text-align:right;margin:8px 0;font-size:18px;"><strong>Grand Total: ₹${totalAmount}</strong></p>

      <h4 style="margin-bottom:6px;color:#083b20;">Delivery Address</h4>
      <p style="margin:6px 0;">${address}</p>

      <p style="margin:8px 0;"><strong>Payment:</strong> ${paymentMethod}</p>

      <div style="margin-top:18px;padding:12px;background:#f7fff7;border-radius:8px;border:1px solid #e6efe6;">
        <p style="margin:0;font-size:14px;">You can view and manage this order in the admin panel.</p>
        <p style="margin:6px 0 0;font-size:13px;color:#556655;">Order Date: ${orderDate}</p>
      </div>

    </div>
    <div style="background:#f0f6f0;padding:12px;text-align:center;color:#556655;font-size:13px;">MG Fresh • Fresh Products • Fast Delivery</div>
  </div>
</body>
</html>`;

    const mailOptions = {
      from: `"MG Fresh" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Order Received - #${orderId}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Send admin order email error:", error);
    return false;
  }
};

export default sendAdminOrderEmail;
