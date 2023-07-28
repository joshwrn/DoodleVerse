import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type Player = {
  userId: string
  brushColor: string
  avatar: 'man' | 'woman'
  position: {
    x: number
    y: number
    z: number
  }
  rotationY: number
}

export const usePlayerStore = create<{
  userId: string
  setUserId: (userId: string) => void
  otherPlayers: Player[]
  setOtherPlayers: (otherPlayers: Player[]) => void
}>((set) => ({
  userId: nanoid(),
  setUserId: (userId) => set({ userId }),
  otherPlayers: [],
  setOtherPlayers: (otherPlayers) => set({ otherPlayers }),
}))
