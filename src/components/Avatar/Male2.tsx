import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  useMovementControls,
  useMovementStore,
} from '@/state/movement/controls'
import { useCameraStore } from '../FpsCamera'
import { emitPlayerEvent } from '@/server/events/client/playerEvent'
import { useSocketState } from '@/server/clientSocket'

let walkDirection = new THREE.Vector3()
let rotateAngle = new THREE.Vector3(0, 1, 0)

const directionOffset = ({
  forward,
  backward,
  left,
  right,
}: {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}) => {
  let directionOffset = 0 // w
  if (backward) {
    if (right) {
      directionOffset = Math.PI / 4 // w + a
    } else if (left) {
      directionOffset = -Math.PI / 4 // w + d
    }
  } else if (forward) {
    if (right) {
      directionOffset = Math.PI / 4 + Math.PI / 2 // s + a
    } else if (left) {
      directionOffset = -Math.PI / 4 - Math.PI / 2 // s + d
    } else {
      directionOffset = Math.PI // s
    }
  } else if (right) {
    directionOffset = Math.PI / 2 // a
  } else if (left) {
    directionOffset = -Math.PI / 2 // d
  }
  return directionOffset
}

export function Male2(props: JSX.IntrinsicElements['group']) {
  const outer = useRef<THREE.Group>(null)
  const { forward, backward, left, right, sprint } = useMovementStore((s) => s)
  useMovementControls()
  const camObj = useCameraStore((s) => s.camObj)

  const socket = useSocketState((s) => s.socket)

  const updateCameraPosition = () => {
    if (!camObj || !outer.current) return
    // move camera
    outer.current.getWorldPosition(camObj.position)

    emitPlayerEvent(socket, {
      position: { z: outer.current.position.z, x: outer.current.position.x },
    })
  }

  useFrame((state, delta) => {
    if (!outer.current || !camObj) return

    // copy camera position to group
    outer.current.rotation.y = THREE.MathUtils.lerp(
      outer.current.rotation.y,
      camObj.rotation.y,
      0.1
    )
    if (forward || backward || left || right) {
      // diagonal movement angle offset
      let newDirectionOffset = directionOffset({
        forward,
        backward,
        left,
        right,
      })

      // calculate direction
      camObj.getWorldDirection(walkDirection)
      walkDirection.y = 0
      walkDirection.normalize()
      walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset)

      // run / walk velocity
      const velocity = sprint ? 70 : 50

      // move model & camera
      const moveX = walkDirection.x * velocity * delta
      const moveZ = walkDirection.z * velocity * delta
      outer.current.position.x += moveX
      outer.current.position.z += moveZ
      updateCameraPosition()
    }
  })

  return (
    <>
      <group ref={outer} position={[100, 0, -10]}></group>
    </>
  )
}
