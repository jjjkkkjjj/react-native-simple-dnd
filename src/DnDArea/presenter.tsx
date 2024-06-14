import React from 'react';
import { View, LayoutChangeEvent } from 'react-native';

export const DnDArea = (props: DnDAreaProps) => {
  const { children, onLayout } = props;
  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      {children}
    </View>
  );
};

export interface DnDAreaContainerProps {
  /** Child components */
  children?: React.ReactNode;
}

export interface DnDAreaProps extends DnDAreaContainerProps {
  /** The function when this component is rendered */
  onLayout?: (_e: LayoutChangeEvent) => void;
}
