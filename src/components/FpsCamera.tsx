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

export const FpsCamera = () => {
  const { camera } = useThree((s) => ({
    camera: s.camera,
  }))
  const camObj = useMemo(() => new THREE.Object3D(), [])
  const { setCamObj } = useCameraStore()
  const movement = useRef({ x: 0, y: 0 })

  const { settingsOpen } = useSettingsStore((s) => ({
    settingsOpen: s.settingsOpen,
  }))
  const lockRef = useRef<any>(null)

  useEffect(() => {
    if (!lockRef.current) return
    if (settingsOpen) {
      lockRef.current.unlock()
    }
    if (!settingsOpen) {
      lockRef.current.lock()
    }
  }, [settingsOpen])

  useEffect(() => {
    if (!camObj) return
    camObj.add(camera)
    setCamObj(camObj)
  }, [camObj, , camera, setCamObj])

  useEffect(() => {
    let onMouseMove = (event: any) => {
      movement.current.x = event.movementX
      movement.current.y = event.movementY
    }
    document.addEventListener('mousemove', onMouseMove, false)
    document.addEventListener(
      'click',
      () => {
        document.body.requestPointerLock()
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
