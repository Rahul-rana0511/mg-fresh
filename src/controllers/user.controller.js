import authServices from "../services/auth.services.js";
import adminServices from "../services/admin.services.js";
const userController = {
  dropTables: async (req, res) => {
    await authServices.dropTables(req, res);
  },
  uploadImages: async (req, res) => {
    await authServices.uploadImages(req, res);
  },

  login: async (req, res) => {
    await authServices.login(req, res);
  },

  logout: async (req, res) => {
    await authServices.logout(req, res);
  },
  deleteAccount: async (req, res) => {
    await authServices.deleteAccount(req, res);
  },

  resendOTP: async (req, res) => {
    await authServices.resendOTP(req, res);
  },
  verifyOTP: async (req, res) => {
    await authServices.verifyOTP(req, res);
  },
  getProfile: async (req, res) => {
    await authServices.getProfile(req, res);
  },
  createSuperAdmin: async (req, res) => {
    await authServices.createSuperAdmin(req, res);
  },
  updateProduct: async (req, res) => {
    await adminServices.updateProduct(req, res);
  },
  addProduct: async (req, res) => {
    await adminServices.addProduct(req, res);
  },
  delProduct: async (req, res) => {
    await adminServices.delProduct(req, res);
  },
  getProducts: async (req, res) => {
    await adminServices.getProducts(req, res);
  },
  getProductDetails: async (req, res) => {
    await adminServices.getProductDetails(req, res);
  },
  updateBasket: async (req, res) => {
    await adminServices.updateBasket(req, res);
  },
  addBasket: async (req, res) => {
    await adminServices.addBasket(req, res);
  },
  delBasket: async (req, res) => {
    await adminServices.delBasket(req, res);
  },
  getBaskets: async (req, res) => {
    await adminServices.getBaskets(req, res);
  },
  getBasketDetails: async (req, res) => {
    await adminServices.getBasketDetails(req, res);
  },
};
export default userController;
