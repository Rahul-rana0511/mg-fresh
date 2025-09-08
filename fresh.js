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

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
