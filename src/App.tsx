import "./styles.css";
import type { Styles, Columns } from "./Table";
import { Table } from "./Table";

const tableStyles: Styles = {
  width: "100%"
  // TODO: Add custom styles after table is set
};

const rows = [...Array(10)].map((_, i) => ({
  title: `title #${i}`,
  author: `author #${i}`
}));

const columns: Columns<typeof rows[number]> = [
  {
    header: "Book Title",
    value: (r) => r.title
  },
  {
    header: "Book Author",
    value: (r) => r.author
  }
];

export default function App() {
  return (
    <>
      <h1>Drag & Drop Table</h1>
      <hr />
      <Table css={tableStyles} rows={rows} columns={columns} />
    </>
  );
}
