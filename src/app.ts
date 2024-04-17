import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import employeeRoutes from "./routes/employee.routes";

const app = express();
app.use(morgan("dev"));
app.use(cors({ origin: "*", methods: "GET, POST, PUT, DELETE", allowedHeaders: "Content-Type" }));
app.use(express.json());
app.use(userRoutes);
app.use(employeeRoutes);

export default app;