import { create } from "zustand"

type State = {
  items: number
  addItem: () => void
  removeItem: () => void
}

const useCartStore = create<State>((set) => ({
  items: 0,
  addItem: () => set((state) => ({ items: state.items + 1 })),
  removeItem: () =>
    set((state) => ({ items: state.items ? state.items - 1 : 0 })),
}))

export default useCartStore
