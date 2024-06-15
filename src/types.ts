import React from 'react';
import { StyleProp, ViewStyle, LayoutRectangle } from 'react-native';

export interface DnDEventHandlers<T, U extends object> {
  /** The function to be called when the dragging starts */
  onDragStart?: () => void;
  /** The function for style parameters to be called when the dragging starts */
  onDragStartForStyleParams?: (_styleParams?: U) => U;
  /** The function to be called when the dragging ends */
  onDragEnd?: () => void;
  /** The function for style parameters to be called when the dragging ends */
  onDragEndForStyleParams?: (_styleParams?: U) => U;
  /** The function to be called when a dragged component hovers this component */
  onDraggedItemHovered?: (_draggedItem: DnDItemType<any>) => void;
  /** The function for style parameters to be called when a dragged component hovers this component */
  onDraggedItemHoveredForStyleParams?: (
    _styleParams: U | undefined,
    _draggedItem: DnDItemType<any>,
    _droppedItem: DnDItemType<T>,
  ) => U;
  /** The function for style parameters to be called when a dragged component hovers this component
   * (for admin)
   */
  _onDraggedItemHoveredForStyleParams?: (
    _draggedItem: DnDItemType<any>,
  ) => void;
  /** The function for style parameters to be called when a dragged component DOESN'T hovers this component */
  onDraggedItemNotHoveredForStyleParams?: (
    _styleParams: U | undefined,
    _draggedItem: DnDItemType<any>,
  ) => U;
  /** The function for style parameters to be called when a dragged component DOESN'T hovers this component
   * (for admin)
   */
  _onDraggedItemNotHoveredForStyleParams?: (
    _draggedItem: DnDItemType<any>,
  ) => void;
  /** The function for style parameters to be reseted
   * (for admin)
   */
  _resetStyleParams?: () => void;
  /** The function to be called when the dragging component is dropped into droppable component */
  onDropped?: (
    _draggedItem?: DnDItemType<T>,
    _droppedItem?: DnDItemType<any>,
  ) => void;
}

export interface DnDType<T, U extends object> {
  /** The unique key to manage the component */
  keyValue: string;
  /** The parent unique key to manage the component (This is needed to avoid overlapping during dragging the child DnDable component) */
  parentkeyValue?: string;
  /** The custom item */
  item?: T;
  /** The custom parameters for style */
  styleParams?: U;
  /** The event handlers */
  eventHandlers?: DnDEventHandlers<T, U>;

  // ==== position ==== //
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

  // ==== style ==== //
  /** The container style */
  containerStyle?: StyleProp<ViewStyle>;

  /** The child component or functional component */
  children?: ((_styleParams?: U) => React.ReactElement) | React.ReactElement;
}

export interface DroppableInformation<T, U extends object> {
  /** The layout information
   * The x coordinates relative to parent
   *  x: number;
   * The y coordinates relative to parent
   *  y: number;
   * The width of this component
   *  width: number;
   * The height of this component
   *  height: number;
   */
  layout: LayoutRectangle;
  /** The custom item */
  item?: T;
  /** The event handlers */
  eventHandlers: DnDEventHandlers<T, U>;
}

export interface DroppableInformationManager {
  [key: string]: DroppableInformation<any, any>;
}

export interface DraggableInformation {
  /** Whether to be dragging now or not */
  dragging: boolean;
}

export interface DraggableInformationManager {
  [key: string]: DraggableInformation;
}

export interface DnDAreaManager {}

//=========== For user ===========//
export interface DnDItemType<T> {
  /** The unique key */
  keyValue: string;
  /** The custom item of DnD component */
  item?: T;
}
