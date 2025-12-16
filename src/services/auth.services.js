import * as Model from "../models/index.js";
import { errorRes, successRes } from "../utils/response.js";
import JWT from "jsonwebtoken";
import "dotenv/config";
import sendEmailOtp from "../utils/sendEmailOtp.js";
// import sendOtp from "../utils/twilio.js";
const JWT_SECRET_KEY = process.env.JWT_SECRET;

const authServices = {
  createSuperAdmin: async (req, res) => {
    try {
      const isAdmin = await Model.User.findOne({
        phone_number: 1234567890,
        country_code: "+91",
      });
      if (isAdmin) {
        return successRes(res, 200, "Admin already created");
      }
      const admin = await Model.User.create({
        phone_number: 1234567890,
        country_code: "+91",
        role: 2,
      });

      const responseObj = admin.toObject();
      delete responseObj.password;
      return successRes(res, 200, "Admin created successfully", responseObj);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  uploadImages: async (req, res) => {
    try {
      let image;
      if (req.files && req.files.image) {
        image = `public/${req.files.image[0].filename}`;
      }
      return successRes(res, 200, "Image", { data: image });
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },

  // login: async (req, res) => {
  //   try {
  //     const {
  //       phone_number,
  //       country_code,
  //       device_token,
  //       device_type,
  //       device_model,
  //     } = req.body;
  //     let otp = Math.floor(1000 + Math.random() * 9000);
  //     const user = await Model.User.findOne({
  //       phone_number: phone_number,
  //       country_code: country_code,
  //     });
  //     if (!user) {
  //       const newUser = await Model.User.create({
  //         phone_number,
  //         country_code,
  //         device_token,
  //         device_type,
  //         device_model,
  //         otp,
  //       });
  //       // await sendOtp(
  //       //   `Hi, your mg fresh OTP is ${otp}. It's valid for 10 minutes`,
  //       //   newUser
  //       // );
  //       return successRes(
  //         res,
  //         200,
  //         "OTP has been sent to your provided phone number",
  //         newUser
  //       );
  //     }
  //     if (!user.is_active) {
  //       return errorRes(
  //         res,
  //         400,
  //         "Your Account has been De-activated By Admin"
  //       );
  //     }

  //     user.device_token = device_token;
  //     user.device_model = device_model;
  //     user.device_type = device_type;
  //     user.otp = otp;
  //     await user.save();
  //     // await sendOtp(
  //     //   `Hi, your mg fresh OTP is ${otp}. It's valid for 10 minutes`,
  //     //   user
  //     // );
  //     return successRes(
  //       res,
  //       200,
  //       "OTP has been sent to your provided phone number",
  //       user
  //     );
  //   } catch (err) {
  //     return errorRes(res, 500, err.message);
  //   }
  // },

  login: async (req, res) => {
  try {
    let { email, device_token, device_type, device_model } = req.body;

    if (!email) {
      return errorRes(res, 400, "Email is required");
    }

    email = email.trim().toLowerCase();

    const otp = Math.floor(1000 + Math.random() * 9000);

    let user = await Model.User.findOne({ email });

    if (!user) {
      user = await Model.User.create({
        email,
        device_token,
        device_type,
        device_model,
        otp,
      });

      await sendEmailOtp(email, otp);

      return successRes(
        res,
        200,
        "OTP has been sent to your registered email",
        user
      );
    }

    if (!user.is_active) {
      return errorRes(
        res,
        400,
        "Your account has been de-activated by admin"
      );
    }

    user.device_token = device_token;
    user.device_type = device_type;
    user.device_model = device_model;
    user.otp = otp;

    await user.save();

    await sendEmailOtp(email, otp);

    return successRes(
      res,
      200,
      "OTP has been sent to your registered email",
      user
    );

  } catch (err) {
    return errorRes(res, 500, err.message);
  }
},


  resendOTP: async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await Model.User.findOne({ _id: userId });
      if (!user) {
        return errorRes(res, 404, "User Not Found");
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      const updateData = await Model.User.findByIdAndUpdate(
        userId,
        { $set: { otp: otp } },
        { new: true }
      );
       await sendEmailOtp(updateData?.email, otp);
      return successRes(
        res,
        200,
        "OTP has been Resent to your provided phone number",
        updateData
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { userId, otp } = req.body;
      const user = await Model.User.findOne({ _id: userId });
      if (!user) {
        return errorRes(res, 404, "User not found");
      }
      if (otp == user.otp) {
        user.phone_verified = 1;
        user.otp = null;
        const token = JWT.sign({ userId: user._id }, JWT_SECRET_KEY, {
          expiresIn: "30d",
        });
        const responseObj = user.toObject();
        const response = {
          ...responseObj,
          token,
        };
        await user.save();
        return successRes(
          res,
          200,
          "Email verified successfully.",
          response
        );
      } else {
        return errorRes(res, 400, "Invalid OTP");
      }
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },

  logout: async (req, res) => {
    try {
      const user = await Model.User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            device_token: null,
          },
        },
        { new: true }
      );
      return successRes(res, 200, "User logout successfully", user);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await Model.User.findByIdAndDelete(userId);
      return successRes(res, 200, "User deleted successfully", user);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  dropTables: async (req, res) => {
    try {
      return successRes(res, 200, "Deleted");
    } catch (error) {
      return errorRes(res, 500, err.message);
    }
  },
  getProfile: async (req, res) => {
    try {
      const getData = await Model.User.findById(req.user._id).populate(
        "active_address"
      );
      if (!getData) {
        return errorRes(res, 404, "User not found");
      }
      return successRes(res, 200, "User profile fetched successfully", getData);
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  createProfile: async (req, res) => {
    try {
      const is_profile_completed = req.user.is_profile_completed;
      const updateData = await Model.User.findByIdAndUpdate(
        req.user._id,
        { $set: { ...req.body, is_profile_completed: 1 } },
        { new: true }
      );
      if (!updateData) {
        return errorRes(res, 404, "User not found");
      }
      return successRes(
        res,
        200,
        `User profile ${
          is_profile_completed == 1 ? "updated" : "created"
        }  successfully`,
        updateData
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
};

export default authServices;
