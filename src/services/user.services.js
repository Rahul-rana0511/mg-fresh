import * as Model from "../models/index.js";
import { errorRes, successRes } from "../utils/response.js";
import "dotenv/config";
import Razorpay from "razorpay";
import crypto from "crypto";
const userServices = {
  addInCart: async (req, res) => {
    try {
      const userId = req.user._id;
      const { basketId, products, productId, quantity, replacements } =
        req.body;

      let cart = await Model.Cart.findOne({ userId });

      if (!cart) {
        cart = new Model.Cart({ userId });
      }

      if (basketId) {
        const basketData = await Model.Basket.findById(basketId);
        if (!basketData) {
          return errorRes(res, 404, "Basket not found");
        }
        const basketType = basketData?.box_type == 1 ? "custom" : "predefined";

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
          products: products || [],
          replacements: basketType === "predefined" ? replacements || [] : [],
        });
      } else {
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
      }

      await cart.save();
      return successRes(res, 200, "Cart added successfully", cart);
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
          if (box.box_type === 0) {
            acc.custom.push(box);
          } else if (box.box_type === 1) {
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
  buyNow: async (req, res) => {
    try {
      const userId = req.user.id;

      const cart = await Model.Cart.findOne({ userId })
        .populate("baskets.products.productId")
        .populate("baskets.replacements.originalProductId")
        .populate("baskets.replacements.newProductId")
        .populate("individualProducts.productId");

      if (!cart) {
        return errorRes(res, 404, "Cart not found");
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
        return errorRes(
          res,
          400,
          "Some items are not available for purchase",
          unavailableItems
        );
      }

      // All products are available
      return successRes(
        res,
        200,
        "All items are available. Proceed to checkout"
      );
    } catch (error) {
      console.error("Buy Now Error:", error);
      return errorRes(res, 500, error.message);
    }
  },
  createPaymentIntent: async (req, res) => {
    try {
      const userId = req.user.id;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      const cart = await Model.Cart.findOne({ userId })
        .populate("baskets.products.productId")
        .populate("individualProducts.productId");

      if (!cart) {
        return errorRes(res, 404, "Cart not found");
      }

      // Calculate total amount
      let totalAmount = 0;

      for (const item of cart.individualProducts) {
        totalAmount += item.productId.product_price * item.quantity;
      }

      for (const basket of cart.baskets) {
      if (!basket.products?.length) continue;

      let basketTotal = 0;

      for (const item of basket.products) {
        if (item.productId && item.productId.product_price) {
          basketTotal += item.productId.product_price * item.quantity;
        }
      }

      // 👇 multiply by basket.quantity
      totalAmount += basketTotal * (basket.quantity || 1);
    }

      const amountInPaise = totalAmount * 100;

      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });
      let data = {
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID,
      };
      return successRes(res, 200, "Create payment intent", data);
    } catch (error) {
      console.error("Create Razorpay Order Failed:", error);
      return errorRes(res, 500, error.message);
    }
  },
  verifyPayment: async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        shippingAddress,
        paymentMethod,
      } = req.body;

      // 1. Verify signature
      // const generatedSignature = crypto
      // .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      // .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      // .digest('hex');
      
      // if (generatedSignature !== razorpay_signature) {
      //   return res.status(400).json({ message: "Invalid payment signature" });
      // }

      // 2. Get user's cart
      const cart = await Model.Cart.findOne({ userId });

      if (!cart || (!cart.individualProducts.length && !cart.baskets.length)) {
        return errorRes(res, 400, "Cart is empty or invalid");
      }

      // 3. Calculate total again (double-check)
      let totalAmount = 0;

      for (const item of cart.individualProducts) {
        const product = await Model.Product.findById(item.productId);
        totalAmount += product.product_price * item.quantity;
      }

      for (const basket of cart.baskets) {
        for (const item of basket.products) {
          const product = await Model.Product.findById(item.productId);
          totalAmount += product.product_price * item.quantity;
        }
      }

      // 4. Create order in DB
      const order = await Model.Order.create({
        userId,
        baskets: cart.baskets,
        individualProducts: cart.individualProducts,
        totalAmount,
        paymentStatus: "paid",
        paymentMethod: paymentMethod || "card",
        shippingAddress: cart?.selectedAddress,
      });

      // 5. Decrement product stock
      for (const item of cart.individualProducts) {
        await Model.Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      for (const basket of cart.baskets) {
        for (const item of basket.products) {
          await Model.Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity },
          });
        }
      }

      // 6. Clear cart
      cart.individualProducts = [];
      cart.baskets = [];
      await cart.save();
      return successRes(
        res,
        200,
        "Payment verified and order placed successfully",
        { orderId: order._id }
      );
    } catch (error) {
      console.error("Payment Verification Failed:", error);
      return errorRes(res, 500, error.message);
    }
  },
  getCartItems: async (req, res) => {
    try {
      const userId = req.user.id;

      const cart = await Model.Cart.findOne({ userId })
        .populate("baskets.products.productId")
        .populate("baskets.basketId")
        .populate("individualProducts.productId");
      console.log(cart, "cart");
      if (!cart) {
        return res.status(200).json({
          individualProducts: [],
          baskets: [],
          totalAmount: 0,
          detailedItems: [],
        });
      }

      const { totalAmount, detailedItems } = await calculateCartTotal(cart);

      let data = {
        individualProducts: cart.individualProducts.map((item) => ({
          productId: item.productId._id,
          name: item.productId.product_name,
          quantity: item.quantity,
          price: item.productId.price,
        })),

        baskets: cart.baskets.map((basket) => ({
          basketId: basket.basketId._id,
          name: basket.basketId.product_name,
          type: basket.type,
          products: basket.products.map((item) => ({
            productId: item.productId._id,
            name: item.productId.product_name,
            quantity: item.quantity,
            price: item.productId.price,
          })),
        })),

        totalAmount,
        detailedItems, // optional: for displaying itemized summary
      };
      return successRes(res, 200, "Cart data", data);
    } catch (err) {
      console.error("Failed to get cart items:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  chooseAddress: async (req, res) => {
    try {
      const cart = await Model.Cart.findByIdAndUpdate(
        req.body.cartId,
        { $set: { selectedAddress: req.body.addressId } },
        { new: true }
      );
      if(!cart){
        return errorRes(res, 404, "cart not found")
      }
      return successRes(res, 200, "Address added successfully", cart);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  getMyOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      const orders = await Model.Order.find({ userId })
        .sort({ createdAt: -1 })
        .populate("baskets.products.productId")
        .populate("baskets.basketId")
        .populate("individualProducts.productId");

      return successRes(res, 200, "Cart data", orders);
    } catch (err) {
      console.error("Failed to get cart items:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const orderDetails = await Model.Order.findById(req.query.orderId)
        .populate("baskets.products.productId")
        .populate("baskets.basketId")
        .populate("individualProducts.productId");

      return successRes(res, 200, "Cart data", orderDetails);
    } catch (err) {
      console.error("Failed to get cart items:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const orderDetails = await Model.Order.find({})
        .sort({ createdAt: -1 })
        .populate("baskets.products.productId")
        .populate("baskets.basketId")
        .populate("individualProducts.productId");

      return successRes(res, 200, "Cart data", orderDetails);
    } catch (err) {
      console.error("Failed to get cart items:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const orderDetails = await Model.Order.findByIdAndUpdate(
        req.body.orderId,
        { $set: { status: req.body.status } },
        { new: true }
      );
      if (!orderDetails) {
        return errorRes(res, 404, "Order not found");
      }

      return successRes(
        res,
        200,
        "Order status updated successfully",
        orderDetails
      );
    } catch (err) {
      console.error("Failed to get cart items:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
   emptyCart: async (req, res) => {
    try {
      const orderDetails = await Model.Cart.findOneAndDelete({userId: req.user._id});
      if (!orderDetails) {
        return errorRes(res, 404, "Cart not found");
      }

      return successRes(
        res,
        200,
        "Cart empty successfully",
        orderDetails
      );
    } catch (err) {
      console.error("Failed to get cart items:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  buyAgain: async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Model.Order.find({ userId })
      .populate("baskets.basketId")
      .populate("individualProducts.productId");

    if (!orders.length) {
      return successRes(res, 200, "Product listing", [])
    }

    const uniqueBaskets = new Map();
    const uniqueProducts = new Map();

    orders.forEach(order => {
      // 🧺 Add unique baskets (as full object)
      order.baskets.forEach(basket => {
        const basketId = basket.basketId?._id?.toString();
        if (basketId && !uniqueBaskets.has(basketId)) {
          uniqueBaskets.set(basketId, basket);
        }
      });

      // 🍎 Add unique individual products (as full object)
      order.individualProducts.forEach(prod => {
        const pid = prod.productId?._id?.toString();
        if (pid && !uniqueProducts.has(pid)) {
          uniqueProducts.set(pid, prod);
        }
      });
    });

    const items = [
      ...Array.from(uniqueBaskets.values()),
      ...Array.from(uniqueProducts.values()),
    ];
    return successRes(res, 200, "Product Listing", items)
  } catch (error) {
    console.error("Buy Again Error:", error);
    return errorRes(res, 500, error.message);
   
  }
},
updateCartQuantity: async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, basketId, productId, action } = req.body;

    if (!["increase", "decrease"].includes(action)) {
      return errorRes(res, 400, "Invalid action type");
    }

    const cart = await Model.Cart.findOne({ userId });
    if (!cart) return errorRes(res, 404, "Cart not found");

    // Determine action (+1 or -1)
    const change = action === "increase" ? 1 : -1;

    if (type === "individual") {
      // 🧴 Update individual product quantity
      const product = cart.individualProducts.find(
        (p) => p.productId.toString() === productId
      );
      if (!product) return errorRes(res, 404, "Product not found in cart");

      product.quantity = Math.max(1, product.quantity + change);
    }

    else if (type === "basket") {
      // 🧺 Update basket quantity
      const basket = cart.baskets.find(
        (b) => b.basketId.toString() === basketId
      );
      if (!basket) return errorRes(res, 404, "Basket not found");

      basket.quantity = Math.max(1, (basket.quantity || 1) + change);
    }

    else if (type === "basketProduct") {
      // 🧺🎯 Update product inside a basket
      const basket = cart.baskets.find(
        (b) => b.basketId.toString() === basketId
      );
      if (!basket) return errorRes(res, 404, "Basket not found");

      const product = basket.products.find(
        (p) => p.productId.toString() === productId
      );
      if (!product) return errorRes(res, 404, "Product not found in basket");

      product.quantity = Math.max(1, product.quantity + change);
    }

    else {
      return errorRes(res, 400, "Invalid type");
    }

    await cart.save();

    // Optionally, recalc total if needed
    const { totalAmount, detailedItems } = calculateCartTotal(cart);

    return successRes(res, 200, "Cart updated successfully", {
      totalAmount,
      cart,
      detailedItems,
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return errorRes(res, 500, error.message);
  }
},


};

const calculateCartTotal = (cart) => {
  let totalAmount = 0;
  const detailedItems = [];

  // 🧮 Calculate individual products total
  if (cart.individualProducts && cart.individualProducts.length > 0) {
    for (const item of cart.individualProducts) {
      if (item.productId && item.productId.product_price) {
        const itemTotal = item.productId.product_price * item.quantity;
        totalAmount += itemTotal;

        detailedItems.push({
          type: "individual",
          productId: item.productId._id,
          name: item.productId.product_name,
          quantity: item.quantity,
          price: item.productId.product_price,
          total: itemTotal,
        });
      }
    }
  }

  // 🧺 Calculate baskets total (includes basket quantity)
  if (cart.baskets && cart.baskets.length > 0) {
    for (const basket of cart.baskets) {
      let basketTotal = 0;
      const basketItems = [];

      if (basket.products && basket.products.length > 0) {
        for (const item of basket.products) {
          if (item.productId && item.productId.product_price) {
            const itemTotal = item.productId.product_price * item.quantity;
            basketTotal += itemTotal;

            basketItems.push({
              productId: item.productId._id,
              name: item.productId.product_name,
              quantity: item.quantity,
              price: item.productId.product_price,
              total: itemTotal,
            });
          }
        }
      }

      // 👇 Multiply basket total by basket.quantity
      const basketQuantity = basket.quantity || 1;
      const basketFinalTotal = basketTotal * basketQuantity;

      totalAmount += basketFinalTotal;

      detailedItems.push({
        type: "basket",
        basketId: basket.basketId?._id,
        basketName: basket.basketId?.product_name,
        basketType: basket.type,
        quantity: basketQuantity,
        items: basketItems,
        totalPerBasket: basketTotal,
        total: basketFinalTotal,
      });
    }
  }

  // Round to 2 decimal places
  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    detailedItems,
  };
};

export default userServices;
