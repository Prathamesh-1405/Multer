import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { processFile } from "../service/file.service"; // assuming you have this

const SECRET_KEY =  "supersecretkey";

export const uploadFile = async (req: Request, res: Response): Promise<any>=> {
  // 1️⃣ Retrieve token from headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 2️⃣ If token missing — send 401
  if (!token) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  try {
    // 3️⃣ Optionally verify & decode token (if you want user info)
    const decoded:any = jwt.verify(token, SECRET_KEY);
    console.log("Decoded token:", decoded.userId);

    // 4️⃣ Check if file exists
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // 5️⃣ Process file
    const results = await processFile(req.file.path, decoded.userId);

    // 6️⃣ Return results
    res.json(results);

  } catch (error: any) {
    // If JWT invalid
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    res.status(400).json({ error: error.message });
  }
};
