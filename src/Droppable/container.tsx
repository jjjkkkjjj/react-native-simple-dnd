import React from 'react';
import { View, Platform, NativeModules } from 'react-native';

import { Droppable, DroppableContainerProps } from './presenter';
import { useDroppable } from './hooks';
import { useDragAndDrop } from '../DragAndDropArea';

const DroppableContainer = <T, U extends object>(
  props: DroppableContainerProps<T, U>,
) => {
  const viewRef = React.useRef<View>(null);
  const { registerDroppableLayoutInformation, registerDroppableEventHandlers } =
    useDragAndDrop();
  const {
    information,
    changeInformation,
    managedInsideParams,
    changeManagedInsideParams,
  } = useDroppable(props.insideParams);

  React.useEffect(() => {
    registerDroppableLayoutInformation(props.keyValue, information);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [information]);

  React.useEffect(() => {
    if (props.eventHandlers) {
      registerDroppableEventHandlers(
        props.keyValue,
        {
          ...props.eventHandlers,
        },
        (insideParams) => changeManagedInsideParams(insideParams),
        props.item,
        props.insideParams,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.eventHandlers]);
  const { StatusBarManager } = NativeModules;
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
  return (
    <Droppable
      {...props}
      viewRef={viewRef}
      onLayout={(e) => {
        changeInformation({
          ...e.nativeEvent.layout,
          y: STATUSBAR_HEIGHT + e.nativeEvent.layout.y,
        });
        // viewRef?.current?.measure((x, y, width, height, pageX, pageY) => {
        //   changeInformation({ x: pageX, y: pageY, width, height });
        // });
      }}
      managedInsideParams={managedInsideParams}
    />
  );
};

export default DroppableContainer;
