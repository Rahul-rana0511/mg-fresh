import authServices from "../services/auth.services.js";
import adminServices from "../services/admin.services.js";
import userServices from "../services/user.services.js";
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
createProfile: async (req, res) => {
    await authServices.createProfile(req, res);
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
    createAddress: async (req, res) => {
    await userServices.createAddress(req, res);
  },
   getAddresses: async (req, res) => {
    await userServices.getAddresses(req, res);
  },
   getAddressById: async (req, res) => {
    await userServices.getAddressById(req, res);
  },
   updateAddress: async (req, res) => {
    await userServices.updateAddress(req, res);
  },
   delAddress: async (req, res) => {
    await userServices.delAddress(req, res);
  },
  homeScreen: async (req, res) => {
    await userServices.homeScreen(req, res);
  },
  buyNow: async (req, res) => {
    await userServices.buyNow(req, res);
  },  
  delAddress: async (req, res) => {
    await userServices.delAddress(req, res);
  },
 createPaymentIntent: async (req, res) => {
    await userServices.createPaymentIntent(req, res);
  },
  verifyPayment: async (req, res) => {
    await userServices.verifyPayment(req, res);
  },
  addInCart: async (req, res) => {
    await userServices.addInCart(req, res);
  },
  getCartItems: async (req, res) => {
    await userServices.getCartItems(req, res);
  },
   chooseAddress: async (req, res) => {
    await userServices.chooseAddress(req, res);
  },
   getMyOrders: async (req, res) => {
    await userServices.getMyOrders(req, res);
  },
   getOrderById: async (req, res) => {
    await userServices.getOrderById(req, res);
  },
   getAllOrders: async (req, res) => {
    await userServices.getAllOrders(req, res);
  },
   updateOrderStatus: async (req, res) => {
    await userServices.updateOrderStatus(req, res);
  },
  emptyCart: async (req, res) => {
    await userServices.emptyCart(req, res);
  },
};
export default userController;
