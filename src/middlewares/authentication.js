import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import 'dotenv/config';
import { errorRes } from '../utils/response.js';

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return errorRes(res, 400, "Authorization header is missing")
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if(!user){
      return res.status(501).json({success: false, status: 501, message: "Your Account has been Deleted By Admin"});
    }
    req.user = user;
    await user.save();
     if(user?.is_active == 0){
      return errorRes(res, 501, "Your Account has been Banned By Admin", user);
     }
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({
      status_code:401,
      error: 'Token verification failed',
    });
  }
};

export default authentication;