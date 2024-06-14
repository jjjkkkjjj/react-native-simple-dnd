import React from 'react';
import { RecoilRoot } from 'recoil';

import { DnDArea, DnDAreaContainerProps } from './presenter';
import { useDnDAreaAdmin, useDnDArea, useDragAndDrop } from './hooks';

const DnDAreaContainer = (props: DnDAreaContainerProps) => {
  useDnDAreaAdmin();

  return (
    <RecoilRoot>
      <Wrapper {...props} />
    </RecoilRoot>
  );
};

const Wrapper = (props) => {
  useDnDArea();
  const { reloadLayout } = useDragAndDrop();

  return <DnDArea {...props} onLayout={() => reloadLayout()} />;
};

export default DnDAreaContainer;
