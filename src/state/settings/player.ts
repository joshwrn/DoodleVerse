import { create } from 'zustand'
import { nanoid } from 'nanoid'

export const usePlayerStore = create<{
  userId: string
  setUserId: (userId: string) => void
}>((set) => ({
  userId: nanoid(),
  setUserId: (userId) => set({ userId }),
}))
