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
  /** コンテナのStyle */
  containerStyle?: StyleProp<ViewStyle>;
  /** x座標（Parentに対して） */
  x?: number;
  /** y座標（Parentに対して） */
  y?: number;
  /** X座標の逆（左）方向を正にするか */
  reverseX?: boolean;
  /** Y座標の逆（上）方向を正にするか */
  reverseY?: boolean;
  /** zインデックス */
  zIndex?: number;
  /** ユニークキー */
  keyValue: string;
  /** 任意の管理値 */
  item?: T;
  /** 内部のパラメータ */
  insideParams?: U;
  /** 表示コンポーネント */
  children?: ((_insideParams?: U) => React.ReactNode) | React.ReactNode;
}

export interface DragAndDropAreaType<T, U extends object> {
  /** Droppableの描画情報を管理 */
  droppableLayoutInformation: {
    /** Droppableのキー */
    [key: string]: DroppableLayoutInformation;
  };
  /** DroppableのEventHandlerを管理 */
  droppableEventHandlers: {
    [key: string]: {
      item?: T;
      insideParams?: U;
      insideParamsCallback: (_insideParams?: U) => U;
    } & DroppableEventHandlers<T, U>;
  };
  // /** DraggableのEventHandlerを管理 */
  // draggableEventHandlers: {
  //   [key: string]: DraggableEventHandlers;
  // };
  /** Drop可能かを返す関数 */
  isDroppable: (
    _draggableKey: string,
    _x: number,
    _y: number,
    _mode: 'move' | 'release',
    _draggedItem?: T,
    _callback?: (_draggedItem?: T, _droppedItem?: T) => void,
  ) => boolean;
  /** DroppableのLayout情報を登録する関数 */
  registerDroppableLayoutInformation: (
    _keyValue: string,
    _information: DroppableLayoutInformation,
  ) => void;
  /** DraggableのEventHandlerを登録する関数 */
  registerDroppableEventHandlers: (
    _keyValue: string,
    _eventHandlers: Partial<DroppableEventHandlers<T, U>>,
    _insideParamsCallback: (_insideParams?: U) => U,
    _item?: T,
    _insideParams?: U,
  ) => void;
  // /** DraggableのEventHandlerを登録する関数 */
  // registerDraggableEventHandlers: (
  //   _keyValue: string,
  //   _eventHandlers: Partial<DraggableEventHandlers>,
  // ) => void;
}

export interface DragAndDropAreaContainerProps {
  /** 表示コンポーネント */
  children?: React.ReactNode;
}

export interface DragAndDropAreaProps extends DragAndDropAreaContainerProps {}
