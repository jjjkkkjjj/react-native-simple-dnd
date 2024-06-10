import { useRecoilState, atom } from 'recoil';

import {
  DroppableInformationManager,
  DraggableInformationManager,
  DnDAreaManager,
} from '../types';

export const droppableInformationAtom = atom<DroppableInformationManager>({
  key: 'DroppableInformationAtom',
  default: {},
});
export const useDroppable = () => useRecoilState(droppableInformationAtom);

export const draggableInformationAtom = atom<DraggableInformationManager>({
  key: 'DraggableInformationAtom',
  default: {},
});
export const useDraggable = () => useRecoilState(draggableInformationAtom);

export const dnDareaAtom = atom<DnDAreaManager>({
  key: 'DnDAreaAtom',
  default: {},
});
export const useDnDArea = () => useRecoilState(dnDareaAtom);

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

export const useDragAndDrop = () => {
  const [, setReloadLayoutSwitch] = useRecoilState(reloadLayoutAtom);
  /**
   * Reload layout information.
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
