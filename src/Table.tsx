/** @jsxImportSource @emotion/react */
import { ReactNode } from "react";
import { CSSInterpolation } from "@emotion/serialize";

export type Styles = CSSInterpolation;

type Column<Row> = {
  header: string;
  value: (row: Row) => ReactNode;
};

export type Columns<Row> = Column<Row>[];

type TableProps<Row> = {
  rows: Row[];
  columns: Column<Row>[];
  css: CSSInterpolation;
};

export function Table<Row extends Object>(props: TableProps<Row>) {
  const { rows, columns, css } = props;

  return (
    <table css={css}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={`${row.toString()}${i}`}>
            {columns.map((column) => (
              <td key={`${row.toString()}${i}${column.header}`}>
                {column.value(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
