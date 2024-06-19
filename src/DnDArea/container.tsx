import React from 'react';
import { RecoilRoot } from 'recoil';

import { DnDArea, DnDAreaContainerProps } from './presenter';
import {
  useDnDAreaAdmin,
  useRegisterInformation,
  useDnDRealtimeInformation,
  useDragAndDrop,
} from './hooks';

const DnDAreaContainer = (props: DnDAreaContainerProps) => {
  useDnDAreaAdmin();

  return (
    <RecoilRoot>
      <Wrapper {...props} />
    </RecoilRoot>
  );
};

const Wrapper = (props: DnDAreaContainerProps) => {
  useDnDRealtimeInformation();
  const { setRegisterInformation } = useRegisterInformation();
  const { reloadLayout } = useDragAndDrop();

  React.useEffect(() => {
    const newValues = Object.fromEntries(
      props.keyValues.map((value) => [value, false]),
    );
    setRegisterInformation((prev) => ({ ...prev, ...newValues }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DnDArea {...props} onLayout={() => reloadLayout()} />;
};

export default DnDAreaContainer;
