  import axiosInstance from "./axiosInstance";
import { RowWithErrors } from "@/model/csvtypes";

export const uploadCsvFile = async (file: File): Promise<RowWithErrors[]> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<RowWithErrors[]>("/upload", formData);
  return response.data;
};
