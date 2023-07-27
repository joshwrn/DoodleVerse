import { useSettingsStore } from '@/state/settings/settings'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { create } from 'zustand'

export const useCameraStore = create<{
  camObj: THREE.Object3D | null
  setCamObj: (camObj: THREE.Object3D) => void
}>((set) => ({
  camObj: null,
  setCamObj: (camObj) => set({ camObj }),
}))

const setRotationX = (camObjX: THREE.Object3D<THREE.Event>, mouseY: number) => {
  const newRotationX = camObjX.rotation.x - mouseY * 0.002
  const maxRotationX = Math.PI / 2
  const minRotationX = -Math.PI / 2
  camObjX.rotation.x = THREE.MathUtils.clamp(
    newRotationX,
    minRotationX,
    maxRotationX
  )
}

export const FpsCamera = ({
  canvasRef,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}) => {
  const { camera, get, setEvents } = useThree((s) => s)
  const camObj = useMemo(() => new THREE.Object3D(), [])
  const { setCamObj } = useCameraStore()
  const movement = useRef({ x: 0, y: 0 })

  const { settingsOpen } = useSettingsStore((s) => ({
    settingsOpen: s.settingsOpen,
  }))
  const isLockedRef = useRef<boolean>(false)

  useEffect(() => {
    if (settingsOpen) {
      isLockedRef.current = false
      document.exitPointerLock()
    }
    if (!settingsOpen) {
      isLockedRef.current = true
      canvasRef.current?.requestPointerLock()
    }
  }, [settingsOpen, canvasRef])

  useEffect(() => {
    if (!camObj) return
    camObj.add(camera)
    setCamObj(camObj)
  }, [camObj, camera, setCamObj])

  useEffect(() => {
    const oldComputeOffsets = get().events.compute
    setEvents({
      compute(event, state) {
        const offsetX = state.size.width / 2
        const offsetY = state.size.height / 2
        state.pointer.set(
          (offsetX / state.size.width) * 2 - 1,
          -(offsetY / state.size.height) * 2 + 1
        )
        state.raycaster.setFromCamera(state.pointer, state.camera)
      },
    })
    return () => {
      setEvents({
        compute: oldComputeOffsets,
      })
    }
  }, [])

  useEffect(() => {
    let onMouseMove = (event: any) => {
      if (!isLockedRef.current) return
      movement.current.x = event.movementX
      movement.current.y = event.movementY
    }
    document.addEventListener('mousemove', onMouseMove, false)
    document.addEventListener(
      'pointerlockchange',
      (e) => {
        console.log('pointerlockchange', e)
        if (document.pointerLockElement === canvasRef.current) {
          isLockedRef.current = true
        } else {
          isLockedRef.current = false
        }
      },
      false
    )
    document.addEventListener(
      'click',
      () => {
        canvasRef.current?.requestPointerLock()
        isLockedRef.current = true
      },
      false
    )
  }, [])

  useFrame((state, delta) => {
    if (!camObj || !movement.current) return
    const { x, y } = movement.current
    if (x || y) {
      // y is left/right
      camObj.rotation.y -= x * 0.002
      // x is up/down
      setRotationX(camera, y)

      movement.current.x = 0
      movement.current.y = 0
    }
  })

  return (
    <>
      <primitive object={camObj} />
    </>
  )
}
