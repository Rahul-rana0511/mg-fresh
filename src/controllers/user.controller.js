import authServices from "../services/auth.services.js";
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
};
export default userController;
