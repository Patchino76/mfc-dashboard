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

// ---------------------------------- Tree SST Downtime Analysis Page -----------------------------------
interface TreeFlowItemsProps {
  selectedTreeItem: string;
  setSelectedTreeItem: (item: string) => void;
}

export const useTreeFlowItems = create<TreeFlowItemsProps>((set) => ({
  selectedTreeItem: "Питател 1",
  setSelectedTreeItem: (item: string) => set({ selectedTreeItem: item }),
}));

interface DtAnalysisTypeProps {
  type: string;
  label: string;
  setType: (type: string, label: string) => void;
}

export const useDtAnalysisType = create<DtAnalysisTypeProps>((set) => ({
  type: "frequency",
  label: "Събития",
  setType: (type: string, label: string) => set({ type, label }),
}));
