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
   * The function that the layout information is changed
   * @param newInformation the new layout information
   */
  const changeInformation = (newInformation: DroppableLayoutInformation) => {
    setInformation(newInformation);
  };

  /**
   * The function that the custom inside parameters is changes
   * @param insideParams the custom paramters
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
