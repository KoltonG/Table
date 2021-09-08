import { useRef, useState } from "react";
import { clamp, distance } from "popmotion";
import { arrayMoveImmutable } from "array-move";

type Positions = {
  height: number;
  top: number;
}[];

export function usePositionReorder<Row>(rows: Row[]) {
  const [order, setOrder] = useState(rows);
  console.log("order: ", order);

  // Array holding positioning information for each row
  const positions = useRef<Positions>([]).current;
  const updatePosition = (i: number, offset: Positions[number]) =>
    (positions[i] = offset);

  const updateOrder = (i: number, dragOffset: number) => {
    const targetIndex = findIndex(i, dragOffset, positions);
    console.log(targetIndex);
    if (targetIndex !== i) setOrder(arrayMoveImmutable(order, i, targetIndex));
  };

  return { order, updatePosition, updateOrder };
}

const buffer = 0;

function findIndex(i: number, yOffset: number, positions: Positions) {
  let target = i;
  const { top, height } = positions[i];
  const bottom = top + height;
  // If moving down
  if (yOffset > 0) {
    const nextItem = positions[i + 1];
    if (nextItem === undefined) return i;
    debugger;

    const swapOffset =
      distance(bottom, nextItem.top + nextItem.height / 2) + buffer;
    if (yOffset > swapOffset) target = i + 1;

    // If moving up
  } else if (yOffset < 0) {
    const prevItem = positions[i - 1];
    if (prevItem === undefined) return i;

    const prevBottom = prevItem.top + prevItem.height;
    const swapOffset = distance(top, prevBottom - prevItem.height / 2) + buffer;
    if (yOffset < -swapOffset) target = i - 1;
  }
  debugger;
  return clamp(0, positions.length, target);
}
