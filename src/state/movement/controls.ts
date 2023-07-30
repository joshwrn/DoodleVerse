import { useHotkeys } from 'react-hotkeys-hook'
import { create } from 'zustand'

export type Movement = {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  sprint: boolean
}
type MovementKeys = keyof Movement

const KEYS: { [key: string]: MovementKeys } = {
  KeyW: `forward`,
  KeyS: `backward`,
  KeyA: `left`,
  KeyD: `right`,
  Space: `jump`,
  ShiftLeft: `sprint`,
}
type Keys = keyof typeof KEYS

const moveFieldByKey = (key: Keys): MovementKeys => KEYS[key] as MovementKeys

const keyGuard = (e: KeyboardEvent): Keys | null => {
  if (Object.keys(KEYS).includes(e.code)) {
    return e.code as Keys
  }
  return null
}

export const useMovementStore = create<{
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  sprint: boolean
  setMovement: (movement: Partial<Movement>) => void
}>((set) => ({
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false,
  setMovement: (movement: Partial<Movement>) =>
    set((prev) => ({ ...prev, ...movement })),
}))

export const useMovementControls = (): void => {
  const [setMovement] = useMovementStore((s) => [s.setMovement])
  useHotkeys(
    [`w`, `s`, `a`, `d`, `space`, `shift`],
    (e) => {
      const code = keyGuard(e)
      if (!code) return
      const key = moveFieldByKey(code)
      setMovement({ [key]: true })
    },
    {
      keydown: true,
    }
  )
  useHotkeys(
    [`w`, `s`, `a`, `d`, `space`, `shift`],
    (e) => {
      const code = keyGuard(e)
      if (!code) return
      const key = moveFieldByKey(code)
      setMovement({ [key]: false })
    },
    {
      keyup: true,
    }
  )
}
