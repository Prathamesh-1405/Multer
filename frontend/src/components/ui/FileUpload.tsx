/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RowWithErrors } from "@/model/csvtypes";

interface Props {
  onUploadComplete: (results: RowWithErrors[]) => void;
}

export const FileUpload: React.FC<Props> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axiosInstance.post("/upload", formData);
      onUploadComplete(res.data);
    } catch (error: any) {
      console.log(error.response.data)
      alert(error.response?.data?.error || "Upload failed.");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-4 items-center">

      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload File"}
      </Button>
    </div>
  );
};
