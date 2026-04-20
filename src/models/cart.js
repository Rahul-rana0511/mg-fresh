import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Baskets (predefined or custom)
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
          quantity: {
          type: Number,
          default: 1
        },
         note:{
          type: String,
          default: null
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
        replacements: [
          {
            originalProductId: {
              type: Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            newProductId: {
              type: Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
          },
        ],
      },
    ],

    // Individual products added directly (not through a basket)
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
        note:{
          type: String,
          default: null
        }
      },
    ],
    selectedAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      default: null
    },
    promoId:{
       type: Schema.Types.ObjectId,
      ref: "PromoCode",
      default: null 
    }
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema, "Carts");

export default Cart;
