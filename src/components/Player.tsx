import type { SphereProps } from '@react-three/cannon'
import { useSphere } from '@react-three/cannon'
import type { Mesh } from 'three'

import { useMovementControls } from '@/state/movement/controls'
import { useUpdatePlayerPosition } from '@/state/movement/position'

export default function Player(props: SphereProps): JSX.Element {
  const [playerRef, playerApi] = useSphere<Mesh>(() => ({
    mass: 1,
    type: `Dynamic`,
    position: [75, 10, 0],
    args: [12],
    ...props,
  }))

  useMovementControls()
  useUpdatePlayerPosition({
    playerRef,
    playerApi,
  })

  return (
    <>
      <mesh ref={playerRef} />
    </>
  )
}
