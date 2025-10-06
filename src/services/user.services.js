import * as Model from "../models/index.js";
import { errorRes, successRes } from "../utils/response.js";
import "dotenv/config";

const userServices = {
  addInCart: async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        type,
        basketId,
        name,
        products,
        productId,
        quantity,
        replacements,
      } = req.body;

      let cart = await Model.Cart.findOne({ userId });

      if (!cart) {
        cart = new Model.Cart({ userId });
      }

      if (type === "basket") {
        const basketType = name ? "custom" : "predefined";

        // Validate replacements only for predefined basket
        if (
          basketType === "predefined" &&
          replacements &&
          replacements.length > 3
        ) {
          return res.status(400).json({
            success: false,
            message:
              "You can only replace up to 3 products in a predefined basket.",
          });
        }

        cart.baskets.push({
          basketId,
          type: basketType,
          name: name || null,
          products: products || [],
          replacements: basketType === "predefined" ? replacements || [] : [],
        });
      } else if (type === "product") {
        // Add individual product
        const existingProduct = cart.individualProducts.find(
          (p) => p.productId.toString() === productId
        );

        if (existingProduct) {
          existingProduct.quantity += quantity || 1;
        } else {
          cart.individualProducts.push({
            productId,
            quantity: quantity || 1,
          });
        }
      } else {
        return errorRes(res, 400, "Invalid type");
      }

      await cart.save();
      return successRes(res, 200, "Cart added successfully", Cart);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  createAddress: async (req, res) => {
    try {
      if (req.body.lat && req.body.long) {
        req.body.location = {
          type: "Point",
          coordinates: [req.body.long, req.body.lat],
        };
      }
      req.body.userId = req.user._id;
      const address = await Model.Address.create(req.body);
      return successRes(res, 200, "Address added successfully", address);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getAddresses: async (req, res) => {
    try {
      const addresses = await Model.Address.find({ userId: req.user._id });
      return successRes(
        res,
        200,
        "Address list fetched successfully",
        addresses
      );
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  getAddressById: async (req, res) => {
    try {
      const address = await Model.Address.findById(req.params.addressId);
      if (!address) {
        return errorRes(res, 404, "Address noy found");
      }
      return successRes(
        res,
        200,
        "Address details fetched successfully",
        address
      );
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  updateAddress: async (req, res) => {
    try {
      if (req.body.lat && req.body.long) {
        req.body.location = {
          type: "Point",
          coordinates: [req.body.long, req.body.lat],
        };
      }
      const address = await Model.Address.findByIdAndUpdate(
        req.params.addressId,
        req.body,
        {
          new: true,
        }
      );
      if (!address) {
        return errorRes(res, 404, "Address not found");
      }
      return successRes(res, 200, "Address updated successfully", address);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  delAddress: async (req, res) => {
    try {
      const address = await Model.Address.findByIdAndDelete(
        req.params.addressId
      );
      if (!address) {
        return errorRes(res, 404, "Address not found");
      }
      return successRes(res, 200, "Address deleted successfully");
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  homeScreen: async (req, res) => {
    try {
      const allBoxes = await Model.Basket.find({}).lean();
      const boxesFilter = allBoxes.reduce(
        (acc, box) => {
          if (box.box_type === 1) {
            acc.custom.push(box);
          } else if (box.box_type === 2) {
            acc.goodness.push(box);
          }
          return acc;
        },
        {
          custom: [],
          goodness: [],
        }
      );
      const allProducts = await Model.Product.find({}).sort({ createdAt: -1 });
      return successRes(res, 200, "Home screen data fetched successfully", {
        custom: boxesFilter.custom,
        goodness: boxesFilter.goodness,
        products: allProducts,
      });
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  buyNow : async (req, res) => {
  try {
    const userId = req.user.id;
 
    const cart = await Model.Cart.findOne({ userId })
      .populate("baskets.products.productId")
      .populate("baskets.replacements.originalProductId")
      .populate("baskets.replacements.newProductId")
      .populate("individualProducts.productId");
 
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }
 
    const unavailableItems = [];
 
    // 1. Check individual products
    for (const item of cart.individualProducts) {
      const product = item.productId;
      if (!product || product.stock < item.quantity) {
        unavailableItems.push({
          type: "individual",
          productId: product?._id,
          name: product?.name || "Unknown product",
          reason: "Out of stock or insufficient quantity",
        });
      }
    }
 
    // 2. Check products in baskets
    for (const basket of cart.baskets) {
      for (const item of basket.products) {
        const product = item.productId;
        if (!product || product.stock < item.quantity) {
          unavailableItems.push({
            type: "basket",
            basketId: basket.basketId,
            productId: product?._id,
            name: product?.name || "Unknown product",
            reason: "Out of stock or insufficient quantity",
          });
        }
      }
 
      // 3. Optionally, check replacements if needed (optional logic)
      for (const replacement of basket.replacements) {
        const product = replacement.newProductId;
        if (!product || product.stock < 1) {
          unavailableItems.push({
            type: "replacement",
            originalProductId: replacement.originalProductId?._id,
            newProductId: product?._id,
            name: product?.name || "Replacement product unavailable",
            reason: "Replacement product is unavailable or out of stock",
          });
        }
      }
    }
 
    if (unavailableItems.length > 0) {
      return res.status(409).json({
        message: "Some items are not available for purchase.",
        unavailableItems,
      });
    }
 
    // All products are available
    return res.status(200).json({ message: "All items are available. Proceed to checkout." });
 
  } catch (error) {
    console.error("Buy Now Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
},
 createPaymentIntent : async (req, res) => {
  try {
    const userId = req.user.id;
 
    const cart = await Model.Cart.findOne({ userId })
      .populate("baskets.products.productId")
      .populate("individualProducts.productId");
 
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
 
    // Calculate total amount
    let totalAmount = 0;
 
    for (const item of cart.individualProducts) {
      totalAmount += item.productId.price * item.quantity;
    }
 
    for (const basket of cart.baskets) {
      for (const item of basket.products) {
        totalAmount += item.productId.price * item.quantity;
      }
    }
 
    const amountInPaise = totalAmount * 100;
 
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
 
    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Razorpay Order Failed:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
},
 verifyPayment : async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      shippingAddress,
      paymentMethod,
    } = req.body;
 
    // 1. Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
 
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
 
    // 2. Get user's cart
    const cart = await Cart.findOne({ userId });
 
    if (!cart || (!cart.individualProducts.length && !cart.baskets.length)) {
      return res.status(400).json({ message: "Cart is empty or invalid" });
    }
 
    // 3. Calculate total again (double-check)
    let totalAmount = 0;
 
    for (const item of cart.individualProducts) {
      const product = await Product.findById(item.productId);
      totalAmount += product.price * item.quantity;
    }
 
    for (const basket of cart.baskets) {
      for (const item of basket.products) {
        const product = await Product.findById(item.productId);
        totalAmount += product.price * item.quantity;
      }
    }
 
    // 4. Create order in DB
    const order = await Order.create({
      userId,
      baskets: cart.baskets,
      individualProducts: cart.individualProducts,
      totalAmount,
      paymentStatus: "paid",
      paymentMethod: paymentMethod || "card",
      shippingAddress,
    });
 
    // 5. Decrement product stock
    for (const item of cart.individualProducts) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }
 
    for (const basket of cart.baskets) {
      for (const item of basket.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
    }
 
    // 6. Clear cart
    cart.individualProducts = [];
    cart.baskets = [];
    await cart.save();
 
    res.status(200).json({
      message: "Payment verified and order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Payment Verification Failed:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
},
 getCartItems : async (req, res) => {
  try {
    const userId = req.user.id;
 
    const cart = await Cart.findOne({ userId })
      .populate("baskets.products.productId")
      .populate("baskets.basketId")
      .populate("individualProducts.productId");
 
    if (!cart) {
      return res.status(200).json({
        individualProducts: [],
        baskets: [],
        totalAmount: 0,
        detailedItems: [],
      });
    }
 
    const { totalAmount, detailedItems } = await calculateCartTotal(cart);
 
    res.status(200).json({
      individualProducts: cart.individualProducts.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
      })),
 
      baskets: cart.baskets.map((basket) => ({
        basketId: basket.basketId._id,
        name: basket.basketId.name,
        type: basket.type,
        products: basket.products.map((item) => ({
          productId: item.productId._id,
          name: item.productId.name,
          quantity: item.quantity,
          price: item.productId.price,
        })),
      })),
 
      totalAmount,
      detailedItems, // optional: for displaying itemized summary
    });
  } catch (err) {
    console.error("Failed to get cart items:", err);
    res.status(500).json({ message: "Internal server error" });
  }
},
};

export default userServices;
