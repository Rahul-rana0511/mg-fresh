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
// router.route("/updateProfile").put(userController.updateProfile);

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

export default router;
