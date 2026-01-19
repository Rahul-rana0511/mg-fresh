import express from "express";
import dotenv from "dotenv";
import http from 'http';
import morgan from "morgan";
import cors from "cors";
import swagger_ui from "swagger-ui-express"; 
import openapi_docs from "./output.openapi.json" assert { type: "json" };
import connectDB from "./src/config/db.connection.js";
// import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/user.routes.js";
import cron from "node-cron";
import Order from "./src/models/orders.js";
import User from "./src/models/users.js";
import pushNotification from "./src/utils/notificationHandler.js";
// ✅ Load env first
dotenv.config();

const app = express();
const PORT = process.env.PORT; // fallback port

// ✅ CORS should be here before any routes
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Connect to DB
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static("public"));
app.use(morgan('dev'));


// ✅ Routes (if needed later)
// app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// ✅ Swagger Docs
app.use("/docs", swagger_ui.serve, swagger_ui.setup(openapi_docs, {
  title: `Mg fresh Documentation`
}));


cron.schedule("0 0 * * *", async () => {
  console.log("🔁 Running inactivity purchase reminder cron");

  try {
    const users = await Order.aggregate([
      { $match: { status: "purchased" } },
      {
        $group: {
          _id: "$user_id",
           lastOrderAt: { $max: "$createdAt" }
        }
      }
    ]);

    const now = new Date();

    for (const user of users) {
      const diffInDays =
        (now - new Date(user.lastOrderAt)) / (1000 * 60 * 60 * 24);

      if (diffInDays >= 7) {
        const alreadyNotified = await User.findOne({
          _id: user._id,
          is_notification_sent: 1
        });

        if (alreadyNotified) continue;
          await pushNotification({
          user_id: user?._id,
          type: "reminder"
        });
          await User.updateOne(
          { _id: user._id },
          { is_notification_sent: 1 }
        );
      }
    }
  } catch (error) {
    console.error("❌ Cron error:", error);
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
