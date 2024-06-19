import React from 'react';
import {
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
  atom,
} from 'recoil';

import {
  DroppableInformationManager,
  DraggableInformationManager,
  DnDAreaManager,
} from '../types';

// Realtime atom
export const droppableInformationAtom = atom<DroppableInformationManager>({
  key: 'DroppableInformationAtom',
  default: {},
});
// Lazy atom
export const droppableInformationLazyAtom = atom<DroppableInformationManager>({
  key: 'DroppableInformationLazyAtom',
  default: {},
});
export const useDroppable = () => {
  // Return the setter for realtime atom only to avoid too much rendering
  const setDroppableInformation = useSetRecoilState(droppableInformationAtom);
  return { setDroppableInformation };
};

// Realtime atom
export const draggableInformationAtom = atom<DraggableInformationManager>({
  key: 'DraggableInformationAtom',
  default: {},
});
// Lazy atom
export const draggableInformationLazyAtom = atom<DraggableInformationManager>({
  key: 'DraggableInformationLazyAtom',
  default: {},
});
export const useDraggable = () => {
  // Return the setter for realtime atom only to avoid too much rendering
  const setDraggableInformation = useSetRecoilState(draggableInformationAtom);
  return { setDraggableInformation };
};

export const registerInformationAtom = atom<DnDAreaManager>({
  key: 'RegisterInformationAtom',
  default: {},
});
// The switch to update the lazy atoms
export const updateLazyStatesSwitchAtom = atom<boolean>({
  key: 'LazyStatesUpdatingSwitchAtom',
  default: false,
});
export const useRegisterInformation = () => {
  const setRegisterInformation = useSetRecoilState(registerInformationAtom);
  return { setRegisterInformation };
};

// Synchronize the realtime atom and the lazy atom here
export const useDnDRealtimeInformation = () => {
  const [allRegisteredOnce, setAllRegisteredOnce] = React.useState(false);
  // Lazy States to avoid too much rendering
  const setDraggableInformation = useSetRecoilState(
    draggableInformationLazyAtom,
  );
  const setDroppableInformation = useSetRecoilState(
    droppableInformationLazyAtom,
  );
  // RealTime States
  const currentDraggableInformation = useRecoilValue(draggableInformationAtom);
  const currentDroppableInformation = useRecoilValue(droppableInformationAtom);
  const [registerInformation, setRegisterInformation] = useRecoilState(
    registerInformationAtom,
  );
  const updateLazyStatesSwitch = useRecoilValue(updateLazyStatesSwitchAtom);
  const { reloadLayoutSwitch } = useReloadLayout();
  const allRegistered = React.useMemo(
    () =>
      Object.keys(registerInformation).every(
        (keyValue) => registerInformation[keyValue],
      ),
    [registerInformation],
  );
  React.useEffect(() => {
    if (allRegistered) {
      setDraggableInformation({ ...currentDraggableInformation });
      setDroppableInformation({ ...currentDroppableInformation });
      const newValue = Object.fromEntries(
        Object.keys(registerInformation).map((keyValue) => [keyValue, false]),
      );
      // console.log('called', currentDroppableInformation);
      setRegisterInformation(newValue);
      setAllRegisteredOnce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRegistered, currentDraggableInformation, currentDroppableInformation]);

  // Update the lazy states into the latest ones
  React.useEffect(() => {
    if (allRegisteredOnce) {
      setDraggableInformation({ ...currentDraggableInformation });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRegisteredOnce, updateLazyStatesSwitch, currentDraggableInformation]);

  // Reset when reloaded
  React.useEffect(() => {
    const newValue = Object.fromEntries(
      Object.keys(registerInformation).map((keyValue) => [keyValue, false]),
    );
    // console.log('called', currentDroppableInformation);
    setRegisterInformation(newValue);
    setAllRegisteredOnce(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadLayoutSwitch]);

  return null;
};

// To handle the lazy atoms only to avoid too much rendering due to the realtime atoms
export const useDnDLazyInformation = () => {
  const draggableInformation = useRecoilValue(draggableInformationLazyAtom);
  const droppableInformation = useRecoilValue(droppableInformationLazyAtom);
  const setRegisterInformation = useSetRecoilState(registerInformationAtom);
  const setUpdateLazyStatesSwitch = useSetRecoilState(
    updateLazyStatesSwitchAtom,
  );

  /**
   * Update the lazy states into the latest ones
   */
  const updateLazyStates = () => {
    setUpdateLazyStatesSwitch((prev) => !prev);
  };

  return {
    draggableInformation,
    droppableInformation,
    setRegisterInformation,
    updateLazyStates,
  };
};

export const reloadLayoutAtom = atom<boolean>({
  key: 'ReloadLayoutAtom',
  default: false,
});
export const useReloadLayout = () => {
  const [reloadLayoutSwitch, setReloadLayoutSwitch] =
    useRecoilState(reloadLayoutAtom);
  const reloadLayout = () => {
    setReloadLayoutSwitch((prev) => !prev);
  };
  return { reloadLayoutSwitch, reloadLayout };
};

/**
 * The hooks for user
 * @returns reloadLayout: The function that reloads layout information manually
 */
export const useDragAndDrop = () => {
  const [, setReloadLayoutSwitch] = useRecoilState(reloadLayoutAtom);
  /**
   * Reload layout information manually.
   * This function is useful when the DnDArea is responsible size such like drawer
   */
  const reloadLayout = () => {
    setReloadLayoutSwitch((prev) => !prev);
  };
  return { reloadLayout };
};

// export const DnDAreaContext = React.createContext({} as DnDAreaManager);
// export const useDnDArea = () => React.useContext(DnDAreaContext);

export const useDnDAreaAdmin = () => {
  return null;
};
