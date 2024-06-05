import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import {
  DroppableLayoutInformation,
  DroppableEventHandlers,
} from '../Droppable';
// import { DraggableEventHandlers } from '../Draggable';

export const DragAndDropArea = (props: DragAndDropAreaProps) => {
  const { children } = props;
  return <>{children}</>;
};

export interface DragAndDropSharedType<T, U extends object> {
  /** The container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** The x coordinates relative to parent */
  x?: number;
  /** The y coordinates relative to parent */
  y?: number;
  /** Whether the opposite x direction (left) is positive or not */
  reverseX?: boolean;
  /** Whether the opposite y direction (up) is positive or not */
  reverseY?: boolean;
  /** The z index */
  zIndex?: number;
  /** The uniqui key to manage the component */
  keyValue: string;
  /** The custom item */
  item?: T;
  /** The custom inside parameters */
  insideParams?: U;
  /** The child component or functional component */
  children?: ((_insideParams?: U) => React.ReactNode) | React.ReactNode;
}

export interface DragAndDropAreaType<T, U extends object> {
  /** The layout information for droppable component */
  droppableLayoutInformation: {
    /** Droppableのキー */
    [key: string]: DroppableLayoutInformation;
  };
  /** The event handlers for droppable component */
  droppableEventHandlers: {
    [key: string]: {
      item?: T;
      insideParams?: U;
      insideParamsCallback: (_insideParams?: U) => U;
    } & DroppableEventHandlers<T, U>;
  };
  // /** he event handlers for draggable component */
  // draggableEventHandlers: {
  //   [key: string]: DraggableEventHandlers;
  // };
  /** The function to check if the draggable item is droppable or not */
  isDroppable: (
    _draggableKey: string,
    _x: number,
    _y: number,
    _mode: 'move' | 'release',
    _draggedItem?: T,
    _droppableCallback?: (_draggedItem?: T, _droppedItem?: T) => void,
    _unDroppableCallback?: (_draggedItem?: T, _droppedItem?: T) => void,
  ) => boolean;
  /** The function to register the layout information for the droppable component */
  registerDroppableLayoutInformation: (
    _keyValue: string,
    _information: DroppableLayoutInformation,
  ) => void;
  /** The function to register the event handlers for the droppable component */
  registerDroppableEventHandlers: (
    _keyValue: string,
    _eventHandlers: Partial<DroppableEventHandlers<T, U>>,
    _insideParamsCallback: (_insideParams?: U) => U,
    _item?: T,
    _insideParams?: U,
  ) => void;
  // /** The function to register the event handlers for the draggable component */
  // registerDraggableEventHandlers: (
  //   _keyValue: string,
  //   _eventHandlers: Partial<DraggableEventHandlers>,
  // ) => void;
}

export interface DragAndDropAreaContainerProps {
  /** The children */
  children?: React.ReactNode;
}

export interface DragAndDropAreaProps extends DragAndDropAreaContainerProps {}
