import { Schema, model } from "mongoose";
const productSchema = new Schema(
  {
   

    product_name: {
      type: String,
      default: null
    },
    product_type: {
        type: String,
        default: null
      },
    product_image: {
      type: String,
      default: null
    },
    product_desc: {
      type: String,
      default: null
    },
    discount: {
      type: Number,
      default: null
    },
    product_price: {
      type: Number,
      default: 0
    },
    total_stock: {
      type: Number,
      default: 0
    },
    is_product_out_of_stock: {
      type: Boolean,
      default: false
    },
      
    product_quantity: {
      type: Number,
      default: 0
    },
  },

  { timestamps: true }
);

const Product = model("Product", productSchema, "Products");
export default Product;
