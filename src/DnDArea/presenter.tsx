import React from 'react';
import { View } from 'react-native';

export const DnDArea = (props: DnDAreaProps) => {
  const { children } = props;
  return <View style={{ flex: 1 }}>{children}</View>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DnDAreaContainerProps {
  /** Child components */
  children?: React.ReactNode;
}

export interface DnDAreaProps extends DnDAreaContainerProps {}
