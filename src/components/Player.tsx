import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  useMovementControls,
  useMovementStore,
} from '@/state/movement/controls'
import { useCameraStore } from './FpsCamera'
import { emitPlayerEvent } from '@/server/events/client/playerEvent'
import { useSocketState } from '@/server/clientSocket'
import { useSphere } from '@react-three/cannon'
import type { Mesh } from 'three'

const SPEED = 20
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const speed = new THREE.Vector3()

export function Player(props: JSX.IntrinsicElements['group']) {
  const { forward, backward, left, right, sprint } = useMovementStore((s) => s)
  const camObj = useCameraStore((s) => s.camObj)
  const socket = useSocketState((s) => s.socket)

  useMovementControls()

  const [playerRef, playerApi] = useSphere<Mesh>(() => ({
    mass: 1,
    type: `Dynamic`,
    position: [100, 6, -10],
    args: [12],
    collisionResponse: true,
  }))

  const updateCameraPosition = () => {
    if (!camObj || !playerRef.current) return
    // move camera
    playerRef.current.getWorldPosition(camObj.position)

    emitPlayerEvent(socket, {
      position: {
        z: playerRef.current.position.z,
        x: playerRef.current.position.x,
      },
    })
  }
  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    playerApi.velocity.subscribe((v) => (velocity.current = v))
  }, [])
  useFrame((state, delta) => {
    if (!camObj || !playerRef.current) return

    if (forward || backward || left || right) {
      updateCameraPosition()
    }

    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * (sprint ? 3 : 2))
      .applyEuler(camObj.rotation)
    speed.fromArray(velocity.current)
    playerApi.velocity.set(direction.x, velocity.current[1], direction.z)
  })

  return (
    <>
      <mesh ref={playerRef}></mesh>
    </>
  )
}
