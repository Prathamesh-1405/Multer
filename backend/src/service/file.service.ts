import fs from "fs";
import csv from "csv-parser";
import XLSX from "xlsx";
import { CsvRow } from "../model/Row.model";
import { RowWithErrors } from "../model/RowWithErrors.model";

const isValidEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);
const isValidPhone = (number: string): boolean => /^[0-9]{10}$/.test(number);

const EXPECTED_HEADERS = ["email", "contact", "name"];

export const processFile = (filePath: string): Promise<RowWithErrors[]> => {
  const ext = filePath.split(".").pop();

  return new Promise((resolve, reject) => {
    if (ext === "csv") {
      const results: RowWithErrors[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers: string[]) => {
          validateHeaders(headers, reject);
        })
        .on("data", (data: CsvRow) => {
          const errors: Partial<Record<keyof CsvRow, string>> = {};
          if (!isValidEmail(data.email)) errors.email = "Invalid email";
          if (!isValidPhone(data.contact)) errors.contact = "Invalid number";
          if (!data.name) errors.name = "Name is required";

          results.push({ row: data, errors });
        })
        .on("end", () => {
          fs.unlinkSync(filePath);
          resolve(results);
        })
        .on("error", (err) => reject(err));
    } else if (ext === "xlsx") {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: CsvRow[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[];
      validateHeaders(headers, reject);

      const results: RowWithErrors[] = data.map((row) => {
        const errors: Partial<Record<keyof CsvRow, string>> = {};

        if (!isValidEmail(row.email)) errors.email = "Invalid email";
        if (!isValidPhone(row.contact)) errors.contact = "Invalid number";
        if (!row.name) errors.name = "Name is required";

        return { row, errors };
      });

      // fs.unlinkSync(filePath);
      resolve(results);
    } else {
      // fs.unlinkSync(filePath);
      reject(new Error("Unsupported file type."));
    }
  });
};

const validateHeaders = (headers: string[], reject: (reason?: any) => void) => {
  if (headers.length !== EXPECTED_HEADERS.length) {
    reject(new Error(`File should contain ${EXPECTED_HEADERS.join(", ")} columns.`));
  }

  const isCorrectSequence = EXPECTED_HEADERS.every((col, idx) => headers[idx] === col);
  if (!isCorrectSequence) {
    reject(new Error(`Column order should be: ${EXPECTED_HEADERS.join(" → ")}`));
  }
};
