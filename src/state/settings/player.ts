import { create } from 'zustand'
import { nanoid } from 'nanoid'
import Player from '@/components/Player'

export type Player = {
  userId: string
  brushColor: string
  avatar: number
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
  avatar: number | null
  setAvatar: (avatar: number) => void
}>((set) => ({
  userId: nanoid(),
  setUserId: (userId) => set({ userId }),
  avatar: null,
  setAvatar: (avatar) => set({ avatar }),
  otherPlayers: [],
  setOtherPlayers: (otherPlayers) => set({ otherPlayers }),
}))
