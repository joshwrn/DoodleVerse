import { Mesh } from 'three'
import { create } from 'zustand'

export const useObjectStore = create<{
  objects: Mesh[]
  addObject: (object: Mesh) => void
}>((set) => ({
  objects: [],
  addObject: (object) => set((s) => ({ objects: [...s.objects, object] })),
}))
