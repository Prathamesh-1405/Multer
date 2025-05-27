"use client";
import { useState } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { ResultsTable } from "@/components/ui/ResultTable";
import { RowWithErrors } from "@/model/csvtypes";

export default function HomePage() {
  const [results, setResults] = useState<RowWithErrors[]>([]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">📄 File Upload & Validation</h1>
      <label className="font-bold">Add excel or csv file</label>

      <FileUpload onUploadComplete={setResults} />

      {results.length > 0 && (
        <ResultsTable data={results} rowsPerPage={10} />
      )}
    </div>
  );
}
