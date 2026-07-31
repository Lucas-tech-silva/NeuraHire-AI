import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import aiRoutes from "./src/routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", aiRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

