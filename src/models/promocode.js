import { Schema, model } from "mongoose";

const PromoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // store in uppercase for consistency
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    // type: {
    //   type: String,
    //   enum: ["flat", "percentage"], // flat = ₹100 off, percentage = 10% off
    //   required: true,
    // },
    value: {
      type: Number,
    //   required: true,
      min: 1, // e.g. 10% or ₹50
    },
    minOrderValue: {
      type: Number,
      default: 0, // e.g. only valid if order >= ₹500
    },
    usageLimit: {
      type: Number,
      default: 0, // 0 = unlimited, or set e.g. 100 to limit total uses
    },
   usedBy: [
  {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
],

    usedCount: {
      type: Number,
      default: 0, // automatically increment when used
    },
    perUserLimit: {
      type: Number,
      default: 1, // each user can use this promo 1 time by default
    },
   
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
   
  },
  { timestamps: true }
);

const PromoCode = model("PromoCode", PromoCodeSchema, "PromoCodes");
export default PromoCode;

