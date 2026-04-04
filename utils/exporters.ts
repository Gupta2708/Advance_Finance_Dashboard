import type { Transaction } from "@/types/finance";

const toCsv = (rows: Transaction[]) => {
  const headers = ["id", "date", "description", "merchant", "amount", "category", "type", "note"];
  const escaped = rows.map((row) =>
    headers
      .map((key) => {
        const value = String((row as unknown as Record<string, unknown>)[key] ?? "");
        return `"${value.replaceAll('"', '""')}"`;
      })
      .join(","),
  );

  return [headers.join(","), ...escaped].join("\n");
};

const download = (content: string, fileName: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportTransactionsAsCsv = (transactions: Transaction[]) => {
  download(toCsv(transactions), "transactions-export.csv", "text/csv;charset=utf-8;");
};

export const exportTransactionsAsJson = (transactions: Transaction[]) => {
  download(JSON.stringify(transactions, null, 2), "transactions-export.json", "application/json;charset=utf-8;");
};
