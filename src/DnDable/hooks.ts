import React from 'react';
import { Animated, View } from 'react-native';

export const useDnDable = <U extends object>(
  initialStyleParams: U | undefined,
) => {
  // offset
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [dragRelativeOffset, setDragRelativeOffset] = React.useState({
    x: 0,
    y: 0,
  });
  const pan = React.useRef(new Animated.ValueXY()).current;
  const viewRef = React.useRef<View>(null);
  const [styleParams, setStyleParams] = React.useState<U | undefined>(
    initialStyleParams,
  );

  React.useEffect(() => {
    pan.addListener((value) => setOffset(value));
    return () => pan.removeAllListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    offset,
    pan,
    viewRef,
    styleParams,
    setStyleParams,
    dragRelativeOffset,
    setDragRelativeOffset,
  };
};
