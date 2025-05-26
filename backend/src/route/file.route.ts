import express from "express";
import multer from "multer";
import path from "path";

import { uploadFile } from "../controller/file.controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = [".csv", ".xlsx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and Excel files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.post("/upload", upload.single("file"), uploadFile);

export default router;
