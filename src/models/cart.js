import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of cart item: "predefined", "custom", or "normal"
    cartType: {
      type: String,
      enum: ["predefined", "custom", "normal"],
      required: true,
    },

    // If predefined, link to the predefined basket
    predefinedBasketId: {
      type: Schema.Types.ObjectId,
      ref: "Basket", // assuming you have a Basket/Bundle schema
      default: null,
    },

    // For custom basket (user-created)
    customBasket: {
      products: [
        {
          productId: { type: Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, default: 1 },
        },
      ],
    },

    // For normal product (not in basket)
    product: {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema, "Carts");
export default Cart;
