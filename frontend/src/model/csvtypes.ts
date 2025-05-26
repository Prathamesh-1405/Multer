export interface CsvRow {
  email: string;
  contact: string;
  name: string;
}

export interface RowWithErrors {
  row: CsvRow;
  errors: Partial<Record<keyof CsvRow, string>>;
}
