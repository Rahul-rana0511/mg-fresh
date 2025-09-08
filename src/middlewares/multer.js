import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, "" + Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage }).fields([
  { name: "profile_image" },
  { name: "trip_image" },
  { name: "spot_images" },
  { name: "collection_image" },
  { name: "travel_image" },
  { name: "image" }

]);

export const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};