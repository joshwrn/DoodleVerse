import * as THREE from 'three'
import { create } from 'zustand'

export const usePlayerPositionStore = create<{
  playerSpeed: THREE.Vector3
  setPlayerSpeed: (playerSpeed: THREE.Vector3) => void
}>((set) => ({
  playerSpeed: new THREE.Vector3(),
  setPlayerSpeed: (playerSpeed: THREE.Vector3) => set({ playerSpeed }),
}))
