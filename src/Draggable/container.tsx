import React from 'react';

import { Droppable } from '../Droppable';
import { Draggable, DraggableContainerProps } from './presenter';
import { useDraggable } from './hooks';
// import { useDragAndDropArea } from '../DragAndDropArea';

const DraggableContainer = <T, U extends object>(
  props: DraggableContainerProps<T, U>,
) => {
  const { pan, panResponder, managedInsideParams } = useDraggable(
    props.keyValue,
    props.eventHandlers,
    props.item,
    props.insideParams,
  );
  // ChildrenにDroppableがないか確認
  React.Children.toArray(
    typeof props.children === 'function'
      ? props.children(undefined)
      : props.children,
  ).forEach((child) => {
    if ((child as React.ReactElement).type === Droppable) {
      throw Error(
        // eslint-disable-next-line quotes
        "Draggable doesn't allow to have the Droppable as children. \
        Instead, <Droppable><Draggable>...</Draggable></Droppable>",
      );
    }
  });
  // const { registerDraggableEventHandlers } = useDragAndDropArea();

  // React.useEffect(() => {
  //   if (props.eventHandlers) {
  //     registerDraggableEventHandlers(props.keyValue, {
  //       ...props.eventHandlers,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.eventHandlers]);

  return (
    <Draggable
      {...props}
      pan={pan}
      panResponder={panResponder}
      managedInsideParams={managedInsideParams}
    />
  );
};

export default DraggableContainer;
