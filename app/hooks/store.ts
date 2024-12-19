import { create } from "zustand";

interface SpStore {
  setPoint: number;
  increase: () => void;
  decrease: () => void;
  setSp: (sp: number) => void;
}

const useSetPoint = create<SpStore>((set) => ({
  setPoint: 88,
  increase: () => set((store) => ({ setPoint: store.setPoint + 0.1 })),
  decrease: () => set((store) => ({ setPoint: store.setPoint - 0.1 })),
  setSp: (sp: number) => set({ setPoint: sp }),
}));

export default useSetPoint;

// ---------------------------------- Tree SST Flow Component -----------------------------------
interface TreeFlowItemsProps {
  selectedItem: string;
  setSelectedItem: (item: string) => void;
}

export const useTreeFlowItems = create<TreeFlowItemsProps>((set) => ({
  selectedItem: "",
  setSelectedItem: (item: string) => set({ selectedItem: item }),
}));
