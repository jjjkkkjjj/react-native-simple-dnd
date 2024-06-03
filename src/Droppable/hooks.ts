import React from 'react';

import { DroppableLayoutInformation } from './presenter';

export const useDroppable = <U extends object>(insideParams?: U) => {
  const [managedInsideParams, setManagedInsideParams] = React.useState<
    U | undefined
  >(insideParams);
  const [information, setInformation] =
    React.useState<DroppableLayoutInformation>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });

  /**
   * Droppableの描画情報を変更する処理
   * @param newInformation 新しい描画情報
   */
  const changeInformation = (newInformation: DroppableLayoutInformation) => {
    setInformation(newInformation);
  };

  /**
   * 内部パラメータを変更する処理
   * @param insideParams 内部パラメータ
   */
  const changeManagedInsideParams = (insideParams) => {
    setManagedInsideParams(insideParams);
  };

  return {
    information,
    changeInformation,
    managedInsideParams,
    changeManagedInsideParams,
  };
};
