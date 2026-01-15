import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes"
import authRoutes from "./routes/auth.routes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
