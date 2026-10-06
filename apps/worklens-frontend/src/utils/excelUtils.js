import * as XLSX from "xlsx";

export const exportToExcel = (data, columns, fileName) => {
  const excelData = data.map((row) => {
    console.log("Row data for Excel export:", row);
    const formattedRow = {};

    columns.forEach((column) => {
      formattedRow[column.header] = column.value(row);
    });

    return formattedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
