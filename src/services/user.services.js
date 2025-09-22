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
      const addresses = await Model.Address.find({userId: req.user._id});
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
      const address = await Model.Address.findByIdAndDelete(req.params.addressId);
      if (!address) {
        return errorRes(res, 404, "Address not found");
      }
      return successRes(res, 200, "Address deleted successfully");
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
};

export default userServices;
