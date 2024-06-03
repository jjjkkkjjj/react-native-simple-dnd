import React from 'react';

import { DragAndDropArea, DragAndDropAreaContainerProps } from './presenter';
import { useDragAndDropArea, DragAndDropAreaContext } from './hooks';

const DragAndDropAreaContainer = (props: DragAndDropAreaContainerProps) => {
  const value = useDragAndDropArea();

  return (
    <DragAndDropAreaContext.Provider value={{ ...value }}>
      <DragAndDropArea {...props} />
    </DragAndDropAreaContext.Provider>
  );
};

export default DragAndDropAreaContainer;
