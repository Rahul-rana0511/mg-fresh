import { Schema, model } from "mongoose";
const basketSchema = new Schema(
  {
    basket_name: {
      type: String,
      default: null
    },
    basket_type: {
        type: String,
        default: null
      },
    basket_image: {
      type: String,
      default: null
    },
     products: {
      type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    default: []
  }
  },

  { timestamps: true }
);

const Basket = model("Basket", basketSchema, "Baskets");
export default Basket;
