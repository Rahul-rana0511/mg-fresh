import { Router } from "express";
import { uploadMiddleware } from "../middlewares/multer.js";
import authentication from "../middlewares/authentication.js";
import userController from "../controllers/user.controller.js";
import authorization from "../middlewares/authorization.js";
import { validations } from "../validations/validations.js";
const router = Router();
router.route("/createSuperAdmin").get(userController.createSuperAdmin);

router.route("/dropTables").post(userController.dropTables);
router.route("/uploadImage").post(uploadMiddleware, userController.uploadImages);
router.route("/login").post(userController.login);
router.route("/resendOtp").post( userController.resendOTP);
router.route("/verifyOtp").post(userController.verifyOTP);

router.use(authentication)
router.route("/deleteAccount").delete(userController.deleteAccount);
router.route("/logout").patch(userController.logout);
//--Setting
router.route("/getProfile").get(userController.getProfile);
router.route("/createProfile").put(validations.validateCreateProfile, userController.createProfile);

//--Admin Flow Apis--
router.route("/addProduct").post(validations.validateAddProduct,userController.addProduct);
router.route("/delProduct/:productId").delete(userController.delProduct);
router.route("/getProducts").get(userController.getProducts);
router.route("/getProductDetails/:productId").get(userController.getProductDetails);
router.route("/updateProduct").put(validations.validateUpdateProduct, userController.updateProduct);

router.route("/addBasket").post(validations.validateAddBaskets, userController.addBasket);
router.route("/delBasket/:basketId").delete(userController.delBasket);
router.route("/getBaskets").get(userController.getBaskets);
router.route("/getBasketDetails/:basketId").get(userController.getBasketDetails);
router.route("/updateBasket").put(validations.validateUpdateBaskets, userController.updateBasket);

//Add Address flow
router.route("/createAddress").post(validations.validateCreateAddress, userController.createAddress);
router.route("/getAddresses").get(userController.getAddresses);
router.route("/getAddressById/:addressId").get(userController.getAddressById);
router.route("/delAddress/:addressId").delete(userController.delAddress);
router.route("/updateAddress/:addressId").put(validations.validateUpdateAddress, userController.updateAddress);

//Add Address flow
router.route("/addPromocode").post(userController.addPromocode);
router.route("/getPromocodes").get(userController.getPromocodes);
router.route("/getPromoDetails/:promoId").get(userController.getPromoDetails);
router.route("/delPromocode/:promoId").delete(userController.delPromocode);
router.route("/updatePromocode").put(userController.updatePromocode);
router.route("/updatePromocode").put(userController.updatePromocode);
router.route("/applyPromocode").post(userController.applyPromocode);


//Home & Cart Flow
router.route("/homeScreen").get(userController.homeScreen);
router.route("/buyNow").get(userController.buyNow);
router.route("/createPaymentIntent").post(userController.createPaymentIntent);
router.route("/verifyPayment").post(userController.verifyPayment);
router.route("/addInCart").post(userController.addInCart);
router.route("/emptyCart").post(userController.emptyCart);
router.route("/getCartItems").get(userController.getCartItems);

//Order Flow
router.route("/updateOrderStatus").put(userController.updateOrderStatus);
router.route("/getAllOrders").get(userController.getAllOrders);
router.route("/getOrderById").get(userController.getOrderById);
router.route("/getMyOrders").get(userController.getMyOrders);
router.route("/buyAgain").get(userController.buyAgain);
router.route("/chooseAddress").post(userController.chooseAddress);
router.route("/updateActiveAddress").put(userController.updateActiveAddress);
router.route("/updateCartQuantity").put(userController.updateCartQuantity);
router.route("/removeCartItem").put(userController.removeCartItem);

router.route("/getNotifications").get(userController.getNotifications);







export default router;
