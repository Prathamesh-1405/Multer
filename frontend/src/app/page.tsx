"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RowWithErrors } from "@/model/csvtypes";
import { uploadCsvFile } from "@/lib/api";

const rowsPerPage = 10;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<RowWithErrors[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const data = await uploadCsvFile(file);
      console.log(data)
      setRows(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6">📄 Upload CSV</h2>

      <div className="flex gap-4 mb-8">
        <Input type="file" onChange={handleFileChange} className="w-64" />
        <Button onClick={handleUpload} disabled={!file}>
          Upload
        </Button>
      </div>

      {rows.length > 0 && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Errors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    className={
                      item.errors.email
                        ? "text-red-700 font-medium"
                        : ""
                    }
                  >
                    {item.row.email}
                  </TableCell>
                  <TableCell
                    className={
                      item.errors.contact
                        ? " text-red-700 font-medium"
                        : ""
                    }
                  >
                    {item.row.contact}
                  </TableCell>
                  <TableCell
                    className={
                      item.errors.name
                        ? " text-red-700 font-medium"
                        : ""
                    }
                  >
                    {item.row.name}
                  </TableCell>
                  <TableCell>
                    {Object.values(item.errors).length > 0
                      ? Object.values(item.errors).join(", ")
                      : "✅ No errors"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
