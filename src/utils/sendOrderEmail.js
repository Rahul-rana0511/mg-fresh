import transporter from "./mailer.js";

const sendOrderEmail = async ({ order, cart, user, adminEmail = "rhul@yopmail.com" }) => {
  try {
    const customerName = user?.first_name || user?.email || "Customer";
    const orderId = order?.orderId || order?._id || "-";
    const orderDate = new Date().toLocaleString();
    const paymentMethod = order?.paymentMethod || "-";
    const totalAmount = order?.totalAmount ?? order?.amount ?? 0;

    const address = cart?.selectedAddress?.address_details || "N/A";
    // Build product list HTML
    const productRows = [];

    if (cart?.individualProducts && cart.individualProducts.length) {
      for (const item of cart.individualProducts) {
        const name = item.productId?.product_name || item.productId?.product_name || "Product";
        const qty = item.quantity || 0;
        productRows.push(`
          <div style="padding:12px 0;border-bottom:1px solid #e4ebdf;">
            <div style="font-size:15px;color:#374151;margin-bottom:6px;">${name}</div>
            <div style="font-size:13px;color:#6b7280;">Quantity: ${qty} • Type: Individual</div>
          </div>
        `);
      }
    }

    if (cart?.baskets && cart.baskets.length) {
      for (const basket of cart.baskets) {
        // If basket has a fixed basket_price, show basket-level price only
        const multiplier = basket.quantity || 1;
        if (basket?.basketId?.basket_price && basket.basketId.basket_price > 1) {
          const basketName = basket.basketId?.product_name || "Basket";
          const basketUnitPrice = basket.basketId.basket_price;
          const basketTotal = basketUnitPrice * multiplier;
          productRows.push(`
            <div style="padding:14px 0;border-bottom:1px solid #e4ebdf;">
              <div style="font-size:15px;color:#374151;margin-bottom:6px;">${basketName} x${multiplier}</div>
              <div style="font-size:17px;font-weight:bold;color:#064116;">₹${basketTotal}</div>
            </div>
          `);
        } else {
          if (!basket.products || !basket.products.length) continue;
          for (const item of basket.products) {
            const name = item.productId?.product_name || "Product";
            const qty = (item.quantity || 0) * multiplier;
            productRows.push(`
              <div style="padding:12px 0;border-bottom:1px solid #e4ebdf;">
                <div style="font-size:15px;color:#374151;margin-bottom:6px;">${name}</div>
                <div style="font-size:13px;color:#6b7280;">Quantity: ${qty} • From: Basket</div>
              </div>
            `);
          }
        }
      }
    }

    const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MG Fresh Order Confirmation</title>
</head>

<body style="margin:0;padding:20px;background:#f4f6f3;font-family:Arial,sans-serif;">

  <!-- Main Container -->
  <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.08);border:1px solid #e7eadf;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#064116,#0b5d1e);padding:45px 25px;text-align:center;">

      <!-- Logo -->
      <img src="" alt="MG Fresh" style="width:120px;max-width:100%;margin-bottom:20px;display:inline-block;">

      <h1 style="margin:0;color:#ffffff;font-size:34px;line-height:42px;font-weight:bold;">Order Confirmed 🎉</h1>

      <p style="margin-top:12px;color:#dbe8d7;font-size:16px;line-height:26px;">Thank you for choosing fresh & healthy products</p>

    </div>

    <!-- Content -->
    <div style="padding:35px 30px;" class="mobile-padding">

      <p style="font-size:18px;color:#1f2937;margin-top:0;">Hi <strong>${customerName}</strong>,</p>

      <p style="font-size:15px;color:#4b5563;line-height:28px;">Your order has been placed successfully. We are preparing your fresh products and will deliver them soon.</p>

      <!-- Order Box -->
      <div style="background:#f7faf5;border:1px solid #dfe7d8;border-radius:18px;padding:25px;margin-top:30px;">

        <h2 style="margin:0 0 22px 0;color:#064116;font-size:22px;">📦 Order Details</h2>

        <!-- Details -->
        <div style="margin-bottom:14px;">
          <div style="font-size:14px;color:#6b7280;margin-bottom:4px;">Order ID</div>

          <div style="font-size:16px;font-weight:bold;color:#111827;">#${orderId}</div>
        </div>

        <div style="margin-bottom:14px;">
          <div style="font-size:14px;color:#6b7280;margin-bottom:4px;">Order Date</div>

          <div style="font-size:16px;font-weight:bold;color:#111827;">${orderDate}</div>
        </div>

        <div style="margin-bottom:14px;">
          <div style="font-size:14px;color:#6b7280;margin-bottom:4px;">Payment Method</div>

          <div style="font-size:16px;font-weight:bold;color:#111827;">${paymentMethod}</div>
        </div>

        <!-- Products -->
        <div style="margin-top:25px;border-top:1px solid #d9e3d2;padding-top:10px;">

          ${productRows.join("\n")}

        </div>

        <!-- Total -->
        <div style="margin-top:25px;padding-top:20px;border-top:2px dashed #cfd9c8;text-align:right;">

          <div style="font-size:15px;color:#6b7280;">Total Amount</div>

          <div style="font-size:32px;font-weight:bold;color:#064116;margin-top:6px;">₹${totalAmount}</div>

        </div>

      </div>

      <!-- Delivery -->
      <div style="background:#fffdf8;border:1px solid #ece5d2;border-radius:18px;padding:25px;margin-top:25px;">

        <h2 style="margin:0 0 18px 0;color:#7c5a10;font-size:22px;">🚚 Delivery Address</h2>

        <p style="margin:0;color:#4b5563;line-height:28px;font-size:15px;">${address}</p>

      </div>

      <!-- Footer -->
      <div style="background:#064116;padding:30px 20px;text-align:center;">

        <p style="margin:0;color:#dce8d7;font-size:15px;line-height:26px;">Thank you for shopping with <strong style="color:#ffffff;">MG Fresh</strong> 🌿</p>

        <p style="margin-top:18px;font-size:13px;color:#bdd1b8;">©️ ${new Date().getFullYear()} MG Fresh. All rights reserved.</p>

      </div>

    </div>

  </div>

</body>
</html>`;

    const mailOptions = {
      from: `"MG Fresh" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Order Placed - #${orderId}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Send order email error:", error);
    return false;
  }
};

export default sendOrderEmail;
