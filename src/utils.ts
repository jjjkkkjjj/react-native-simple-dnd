import { LayoutRectangle } from 'react-native';

import { DroppableInformationManager } from './types';

/**
 * The utility function to check whther to be droppable or not
 * @param draggedKeyValue The unique key for dragged component
 * @param point The current point relative to the DnDArea
 * @param dragRelativeOffset The dragged point relative to the parent
 * @param layout The droppable layout
 * @param droppableInformation The droppable information
 * @param droppableCallbacks The callback function when the point is droppable
 * @param unDroppableCallbacks The callback function when the point is NOT droppable
 */
export const checkDroppable = (
  draggedKeyValue: string,
  point: { x: number; y: number },
  dragRelativeOffset: { x: number; y: number },
  layout: LayoutRectangle,
  droppableInformation: DroppableInformationManager,
  droppableCallbacks?: (
    _droppableKeyValue: string,
    _droppableInfo: any,
  ) => void,
  unDroppableCallbacks?: (
    _droppableKeyValue: string,
    _droppableInfo: any,
  ) => void,
) => {
  const draggedTopLeft = {
    x: point.x - dragRelativeOffset.x,
    y: point.y - dragRelativeOffset.y,
  };
  const draggedBottomRight = {
    x: point.x - dragRelativeOffset.x + layout.width,
    y: point.y - dragRelativeOffset.y + layout.height,
  };
  // Check Overlap
  Object.keys(droppableInformation).forEach((keyValue) => {
    if (keyValue === draggedKeyValue) {
      return;
    }
    const layout: LayoutRectangle = droppableInformation[keyValue].layout;
    const droppableInfo = droppableInformation[keyValue];

    // Check Overlap
    const topLeft = {
      x: layout.x,
      y: layout.y,
    };
    const bottomRight = {
      x: layout.x + layout.width,
      y: layout.y + layout.height,
    };
    const droppable = !(
      topLeft.x > draggedBottomRight.x ||
      topLeft.y > draggedBottomRight.y ||
      bottomRight.x < draggedTopLeft.x ||
      bottomRight.y < draggedTopLeft.y
    );

    // Call event handlers along with droppable
    if (droppable) {
      droppableCallbacks?.(keyValue, droppableInfo);
    } else {
      unDroppableCallbacks?.(keyValue, droppableInfo);
    }
  });
};
