import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Baskets included in the order
    baskets: [
      {
        basketId: {
          type: Schema.Types.ObjectId,
          ref: "Basket",
          required: true,
        },
        type: {
          type: String,
          enum: ["predefined", "custom"],
          required: true,
        },
        name: {
          type: String,
          default: null,
        },
        products: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            quantity: {
              type: Number,
              default: 1,
              min: 1,
            },
          },
        ],
      },
    ],

    // Directly added individual products
    individualProducts: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    // Order meta
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi", "wallet"],
      default: "cod",
    },

    shippingAddress: {
       type: Schema.Types.ObjectId,
      ref: "Address",
      default: null
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema, "Orders");

export default Order;
