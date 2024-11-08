import { create } from "zustand";

// interface State {
//   setPoint: number;
// }
interface SpStore {
  setPoint: number;
  increase: () => void;
  decrease: () => void;
  setSetPoint: (sp: number) => void;
}

const useSetPoint = create<SpStore>((set) => ({
  setPoint: 88,
  increase: () => set((store) => ({ setPoint: store.setPoint + 0.1 })),
  decrease: () => set((store) => ({ setPoint: store.setPoint - 0.1 })),
  setSetPoint: (sp: number) => set({ setPoint: sp }),
}));

export default useSetPoint;
