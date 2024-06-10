import React from 'react';
import { RecoilRoot } from 'recoil';

import { DnDArea, DnDAreaContainerProps } from './presenter';
import { useDnDAreaAdmin, useDnDArea } from './hooks';

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

  return <DnDArea {...props} />;
};

export default DnDAreaContainer;
