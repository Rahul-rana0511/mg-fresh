import { Router } from "express";
import { uploadMiddleware } from "../middlewares/multer.js";
import authentication from "../middlewares/authentication.js";
import userController from "../controllers/user.controller.js";

const router = Router();

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


export default router;
