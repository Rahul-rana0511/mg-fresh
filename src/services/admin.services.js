import * as Model from "../models/index.js";
import { errorRes, successRes } from "../utils/response.js";
import "dotenv/config";


const adminServices = {
   
  updateProduct: async (req, res) => {
    try {
      const updateData = await Model.Product.findByIdAndUpdate(
        req.body.productId,
        { $set: { ...req.body } },
        { new: true }
      );
      if (!updateData) {
        return errorRes(res, 404, "Product details not found");
      }
      return successRes(
        res,
        200,
        "Product updated successfully",
        updateData
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  addProduct: async (req, res) => {
    try {
      const addData = await Model.Product.create({
        ...req.body
      });
     
      return successRes(res, 200, "Product added successfully", addData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
 delProduct: async (req, res) => {
    try {
      const delData = await Model.Product.findByIdAndDelete(req.params.productId);
     if(!delData){
        return errorRes(res, 404, "Product details not found")
     }
      return successRes(res, 200, "Product deleted successfully", delData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getProducts: async (req, res) => {
    try {
      const allProducts = await Model.Product.find({}).sort({
        createdAt: -1,
      });
      return successRes(
        res,
        200,
        "Product list fetched successfully",
        allProducts
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getProductDetails: async (req, res) => {
    try {
      const { productId } = req.params;
      const productDetails = await Model.Product.findById(productId);
      if (!productDetails) {
        return errorRes(res, 404, "Product details not found");
      }
      return successRes(
        res,
        200,
        "Product details fetched successfully",
        productDetails
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
    updateBasket: async (req, res) => {
    try {
      const updateData = await Model.Basket.findByIdAndUpdate(
        req.body.basketId,
        { $set: { ...req.body } },
        { new: true }
      );
      if (!updateData) {
        return errorRes(res, 404, "Basket details not found");
      }
      return successRes(
        res,
        200,
        "Basket updated successfully",
        updateData
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  addBasket: async (req, res) => {
    try {
      const addData = await Model.Basket.create({
        ...req.body
      });
     
      return successRes(res, 200, "Basket added successfully", addData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
 delBasket: async (req, res) => {
    try {
      const delData = await Model.Basket.findByIdAndDelete(req.params.basketId);
     if(!delData){
        return errorRes(res, 404, "Basket details not found")
     }
      return successRes(res, 200, "Basket deleted successfully", delData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getBaskets: async (req, res) => {
    try {
      const allBasktets = await Model.Basket.find({}).sort({
        createdAt: -1,
      });
      return successRes(
        res,
        200,
        "Basket list fetched successfully",
        allBasktets
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  getBasketDetails: async (req, res) => {
    try {
      const { basketId } = req.params;
      const basketDetails = await Model.Basket.findById(basketId).populate("products");
      if (!basketDetails) {
        return errorRes(res, 404, "Basket details not found");
      }
      return successRes(
        res,
        200,
        "Basket details fetched successfully",
        basketDetails
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
}

export default adminServices;
