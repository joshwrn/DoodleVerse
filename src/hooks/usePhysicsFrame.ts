import type { MutableRefObject } from 'react'
import { useRef } from 'react'

import type { RootState } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

export const UPDATE_MS = (1000 / 60) * 0.001

export const usePhysicsFrame = (
  fn: ({
    state,
    delta,
    timePassed,
    shouldUpdate,
  }: {
    state: RootState
    delta: number
    timePassed: MutableRefObject<number>
    shouldUpdate: boolean
  }) => void
): void => {
  const timePassed = useRef(0)
  useFrame((state, delta) => {
    timePassed.current += delta
    const shouldUpdate = timePassed.current > UPDATE_MS
    if (shouldUpdate) {
      timePassed.current = 0
    }
    fn({
      state,
      delta,
      timePassed,
      shouldUpdate,
    })
  })
}
