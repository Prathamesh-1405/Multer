import express from "express";
import cors from "cors";
import fileRoutes from "./route/file.route";

const app = express();
app.use(cors());
app.use(express.json());

// CSV upload route
app.use("/", fileRoutes);

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
