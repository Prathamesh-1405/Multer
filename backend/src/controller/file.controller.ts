import { Request, Response } from "express";
import { processFile } from "../service/file.service";

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  try {
    const results = await processFile(req.file.path);
    res.json(results);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
