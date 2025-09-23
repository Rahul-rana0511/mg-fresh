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
      box_type: {
        type: Number,
        default: null,
        description: "0 -> Custom 1 -> Goodness"
      },
      mandatory_products:{
        type: Number,
        default: 0
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
