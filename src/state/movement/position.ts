import { useEffect, useRef, useState } from 'react'

import { Globals } from '@react-spring/three'
import type { PublicApi } from '@react-three/cannon'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'
import { create } from 'zustand'

import { useObjectStore } from '../objects/objects'
import { isSprinting, useMovementStore } from './controls'
import { usePhysicsFrame } from '@/hooks/usePhysicsFrame'

const SPEED = 20
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const speed = new THREE.Vector3()

const raycaster = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(0, -1, 0),
  0,
  10
)

Globals.assign({
  frameLoop: `always`,
})

export const usePlayerSpeedStore = create<{
  playerSpeed: THREE.Vector3
  setPlayerSpeed: (playerSpeed: THREE.Vector3) => void
  isJumping: boolean
  setIsJumping: (isJumping: boolean) => void
}>((set) => ({
  playerSpeed: new THREE.Vector3(),
  setPlayerSpeed: (playerSpeed: THREE.Vector3) => set({ playerSpeed }),
  isJumping: false,
  setIsJumping: (isJumping: boolean) => set({ isJumping }),
}))

export const useUpdatePlayerPosition = ({
  playerRef,
  playerApi,
}: {
  playerRef: React.RefObject<Mesh>
  playerApi: PublicApi
}): void => {
  const { forward, backward, left, right, jump } = useMovementStore((s) => s)
  const { camera } = useThree()
  const { objects } = useObjectStore((s) => ({
    objects: s.objects,
  }))
  const { setPlayerSpeed } = usePlayerSpeedStore((s) => ({
    setPlayerSpeed: s.setPlayerSpeed,
  }))
  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    playerApi.velocity.subscribe((v) => (velocity.current = v))
  }, [])

  const [lastFootstep, setLastFootstep] = useState(0)

  usePhysicsFrame(({ shouldUpdate }) => {
    playerRef.current?.getWorldPosition(camera.position)
    // move backward / forward
    if (shouldUpdate) {
      frontVector.set(0, 0, Number(backward) - Number(forward))
      // move side to side
      sideVector.set(Number(left) - Number(right), 0, 0)
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED * (isSprinting() ? 3 : 2))
        .applyEuler(camera.rotation)
      speed.fromArray(velocity.current)
      playerApi.velocity.set(direction.x, velocity.current[1], direction.z)
    }

    const currentTime = new Date().getTime() / 1000

    const isMoving = direction.x !== 0 || direction.z !== 0
    const timeBetweenFootsteps = isSprinting() ? 0.35 : 0.5
    if (
      lastFootstep + timeBetweenFootsteps < currentTime &&
      isMoving &&
      !jump
    ) {
      setLastFootstep(currentTime)
    }

    // jump
    raycaster.ray.origin.copy(
      playerRef.current?.getWorldPosition(new THREE.Vector3()) ??
        new THREE.Vector3()
    )
    raycaster.ray.origin.y += -2
    const intersections = raycaster.intersectObjects(objects, false)
    const onObject = intersections.length > 0
    if (jump && onObject) {
      playerApi.velocity.set(velocity.current[0], 20, velocity.current[2])
    }
    setPlayerSpeed(speed)
  })
}
