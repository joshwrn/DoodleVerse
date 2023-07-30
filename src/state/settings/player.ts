import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { ServerPlayer } from '@/pages/api/socket'

export type Player = {
  userId: string
  brushColor: string
  avatar: number
  position: {
    x: number
    z: number
  }
  rotationY: number
}

const id = nanoid()

export const usePlayerStore = create<{
  userId: string
  setUserId: (userId: string) => void
  otherPlayers: ServerPlayer[]
  setOtherPlayers: (otherPlayers: ServerPlayer[]) => void
  avatar: number | null
  setAvatar: (avatar: number) => void
}>((set) => ({
  userId: id,
  setUserId: (userId) => set({ userId }),
  avatar: null,
  setAvatar: (avatar) => set({ avatar }),
  otherPlayers: [],
  setOtherPlayers: (otherPlayers) => set({ otherPlayers }),
}))
