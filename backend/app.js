import express from "express";
import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

//routes
app.use("/api/v1/", product);
app.use("/api/v1/", user);
app.use("/api/v1/", order);

app.use(errorHandler);

export default app;
