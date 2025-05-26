import { CsvRow } from "./Row.model";

export interface RowWithErrors {
  row: CsvRow;
  errors: Partial<Record<keyof CsvRow, string>>;
}