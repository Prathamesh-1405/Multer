"use client";
import { useEffect, useState } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { ResultsTable } from "@/components/ui/ResultTable";
import { RowWithErrors } from "@/model/csvtypes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const route = useRouter();
  const [results, setResults] = useState<RowWithErrors[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      route.push("/login");
    }
  }, []);  

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">📄 File Upload & Validation</h1>
      <Link href={"/added"}>
        <Button>User-records</Button>
      </Link>
      <br/>
      <label className="font-bold">Add excel or csv file</label>

      <FileUpload onUploadComplete={setResults} />

      {results.length > 0 && <ResultsTable data={results} rowsPerPage={10} />}
    </div>
  );
}
