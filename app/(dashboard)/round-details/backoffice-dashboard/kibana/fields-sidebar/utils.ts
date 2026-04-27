import { FIELD_MAPPING } from "@/app/(dashboard)/round-details/backoffice-dashboard/kibana/fields-sidebar/types";

export const getFriendlyName = (name: string) => FIELD_MAPPING[name] || name;

export const getDeepValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj._source) || "-";
};

export const generateTableData = (fields: string[], data: any[]) => {
  const headers = fields.map(getFriendlyName);
  const rows = data.map(hit => fields.map(field => getDeepValue(hit, field)));

  const textTable = [headers.join("\t"), ...rows.map(r => r.join("\t"))].join("\n");

  let htmlTable = `<table border="1" style="border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px;">`;
  htmlTable += `<tr style="background-color: #f3f4f6;">${headers.map(h => `<th style="padding: 8px; border: 1px solid #ddd; text-align: left;">${h}</th>`).join('')}</tr>`;
  rows.forEach(row => {
    htmlTable += `<tr>${row.map(cell => `<td style="padding: 8px; border: 1px solid #ddd; vertical-align: top;">${cell}</td>`).join('')}</tr>`;
  });
  htmlTable += `</table>`;

  return { textTable, htmlTable };
};