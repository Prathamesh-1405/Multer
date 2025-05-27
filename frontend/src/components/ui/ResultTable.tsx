"use client";
import { useState } from "react";
import { RowWithErrors, CsvRow } from "@/model/csvtypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx-js-style";



interface Props {
  data: RowWithErrors[];
  rowsPerPage?: number;
}

export const ResultsTable: React.FC<Props> = ({ data, rowsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = data.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const errorCount = data.filter(item => Object.keys(item.errors).length > 0).length;
  const correctCount = data.length - errorCount;

  // const handleExport = () => {
  //   const exportData = data.map(item => ({
  //     Email: item.row.email,
  //     Contact: item.row.contact,
  //     Name: item.row.name,
  //     EmailError: item.errors.email || "",
  //     ContactError: item.errors.contact || "",
  //     NameError: item.errors.name || ""
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Validation Results");
  //   XLSX.writeFile(workbook, "validation-results.xlsx");
  // };

  const handleExport = () => {
  const worksheetData = [
    ["Email", "Contact", "Name"]
  ];

  data.forEach(item => {
    worksheetData.push([
      item.row.email,
      item.row.contact,
      item.row.name
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

 data.forEach((item, index) => {
  const rowNumber = index + 2; 

  const cellAddresses = ["A", "B", "C"];
  const fields: (keyof CsvRow)[] = ["email", "contact", "name"];

  const hasRowError =
    !!item.errors.email || !!item.errors.contact || !!item.errors.name;

  fields.forEach((field, i) => {
    const cellAddress = `${cellAddresses[i]}${rowNumber}`;
    if (worksheet[cellAddress]) {
      const cellStyle: Partial<XLSX.CellStyle> = {};

      
      if (hasRowError) {
        cellStyle.fill = {
          fgColor: { rgb: "FFF9C4" }, 
        };
      }

      if (item.errors[field]) {
        cellStyle.font = {
          color: { rgb: "FF0000" },
          bold: true,
        };
      }

      if (Object.keys(cellStyle).length > 0) {
        worksheet[cellAddress].s = cellStyle;
      }
    }
  });

});



  const workbook = {
    SheetNames: ["Validation Results"],
    Sheets: {
      "Validation Results": worksheet
    }
  };

  XLSX.writeFile(workbook, "validation-results.xlsx", { bookType: "xlsx", type: "binary" });
};


  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="font-medium text-green-600">Correct Rows: {correctCount}</div>
        <div className="font-medium text-red-600">Rows with Errors: {errorCount}</div>
        <Button variant="outline" onClick={handleExport}>
          Export to Excel
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((item, index) => (
            <TableRow key={index} className={item.errors.email || item.errors.contact || item.errors.name ? "bg-yellow-100": ""}>
              <TableCell className={item.errors.email ? "text-red-600 font-medium" : ""}>
                {item.row.email}
              </TableCell>
              <TableCell className={item.errors.contact ? "text-red-600 font-medium" : ""}>
                {item.row.contact}
              </TableCell>
              <TableCell className={item.errors.name ? "text-red-600 font-medium" : ""}>
                {item.row.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <div className="flex items-center px-2">{currentPage} / {totalPages}</div>
        <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};
