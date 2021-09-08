/** @jsxImportSource @emotion/react */
import { RefObject, useEffect } from "react";
import { ReactNode, useRef, useState } from "react";
import { CSSInterpolation } from "@emotion/serialize";
import { motion } from "framer-motion";
import { usePositionReorder } from "./usePositionReorder";

export type Styles = CSSInterpolation;

type Column<Row> = {
  header: string;
  dataFn: (row: Row) => ReactNode;
};

export type Columns<Row> = Column<Row>[];

type TableProps<Row> = {
  rows: Row[];
  columns: Column<Row>[];
  css: CSSInterpolation;
};

export function Table<Row extends Object>(props: TableProps<Row>) {
  const { rows: _rows, columns, css } = props;

  // Used for add drag constraints to rows
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const { order, updatePosition, updateOrder } = usePositionReorder(_rows);

  return (
    <table css={css}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody ref={tbodyRef}>
        {order.map((row, i) => (
          <Row
            key={`row #${i}`}
            i={i}
            data={row}
            columns={columns}
            dragConstraintRef={tbodyRef}
            updatePosition={updatePosition}
            updateOrder={updateOrder}
          />
        ))}
      </tbody>
    </table>
  );
}

function Row<Row extends Object>({
  i,
  data,
  columns,
  dragConstraintRef,
  updatePosition,
  updateOrder
}: {
  i: number;
  data: Row;
  columns: Columns<Row>;
  dragConstraintRef: RefObject<Element>;
  updatePosition: (...args: any[]) => void;
  updateOrder: (i: number, dragOffset: number) => void;
}) {
  const [isDragging, setDragging] = useState(false);

  // Updates the positioning information each time a row
  // renders.
  const rowRef = useRef<HTMLTableRowElement>(null);
  // Must be used in a useEffect to update position information after mount
  useEffect(() =>
    updatePosition(i, {
      height: rowRef.current?.offsetHeight,
      top: rowRef.current?.offsetTop
    })
  );

  return (
    <motion.tr
      ref={rowRef}
      css={{ background: "var(--background)", zIndex: isDragging ? 3 : 1 }}
      layout
      initial="false"
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 3px 3px rgba(0,0,0,0.15)"
      }}
      whileTap={{
        scale: 1.05,
        boxShadow: "0px 5px 5px rgba(0,0,0,0.1)"
      }}
      drag="y"
      dragConstraints={dragConstraintRef}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onViewportBoxUpdate={function onViewportBoxUpdate(_viewportBox, delta) {
        // console.log("onViewportBoxUpdate: ", arguments);

        if (isDragging) {
          debugger;
          updateOrder(i, delta.y.translate);
        }
      }}
    >
      {columns.map((column, i) => (
        <td key={i}>{column.dataFn(data)}</td>
      ))}
    </motion.tr>
  );
}
