import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Host: string= "http://localhost:5000"
export const createUrl= (path: string)=>{
  return `${Host}/${path}`
}