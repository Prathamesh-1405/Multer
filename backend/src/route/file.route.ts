// import express from "express";
// import multer from "multer";
// import path from "path";

// import { uploadFile } from "../controller/file.controller";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname,'../../uploads/'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
  
// });

// const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   const allowedExtensions = [".csv", ".xlsx"];
//   const ext = path.extname(file.originalname).toLowerCase();
//   console.log(ext);
  
//   if (allowedExtensions.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only CSV and Excel files are allowed!"));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
// });

// router.post("/upload", upload.single("file"), uploadFile);

// export default router;



import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

import { uploadFile } from "../controller/file.controller";

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer file type validation
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = [".csv", ".xlsx"];
  const ext = path.extname(file.originalname).toLowerCase();
  console.log(ext);

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and Excel files are allowed!"));
  }
};

// Multer middleware
const upload = multer({
  storage,
  fileFilter,
});

// Upload route
router.post("/upload", upload.single("file"), uploadFile);

// Error handling middleware (same file)
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught:", err.message);

  if (err instanceof Error) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

export default router;
