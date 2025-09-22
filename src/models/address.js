import { Schema, model } from "mongoose";

const addressSchema = new Schema(
  {
     userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
   delivery_details:{
    type: String, 
    default: null
   },
    address_details: {
      type: String,
       default: null
    },
    name: {
      type: String,
     default: null
    },
    country_code: {
      type: String,
    default: null
    },
     phone_number: {
      type: Number,
    default: null
    },
    address_type: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0,0]
      },
    }
  },
  { timestamps: true }
);

// Add geospatial index
addressSchema.index({ location: "2dsphere" });

const Address = model("Address", addressSchema, "Addresses");
export default Address;
