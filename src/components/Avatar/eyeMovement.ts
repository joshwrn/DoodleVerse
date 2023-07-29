import { useFrame } from '@react-three/fiber'
import { useSpring } from 'framer-motion'
import { useEffect } from 'react'
import * as THREE from 'three'

type Nodes = {
  LeftEye: THREE.Bone
  RightEye: THREE.Bone
}

function getMousePos(e: MouseEvent) {
  return { x: e.clientX, y: e.clientY }
}

export const useEyesFollowMouse = (
  nodes: Nodes,
  actions: {
    [x: string]: THREE.AnimationAction | null
  },
  isSelection: boolean
) => {
  const motionX = useSpring(-1.54, { stiffness: 200, damping: 20 })
  const motionZ = useSpring(2.5, { stiffness: 200, damping: 20 })

  useEffect(() => {
    if (!isSelection && actions) {
      actions['idle_eyes']?.play()
    } else if (isSelection && actions) {
      actions['idle_eyes']?.stop()
    }
  }, [actions, isSelection])

  const eyesFollowMouse = (e: MouseEvent, nodes: Nodes) => {
    var coords = getMousePos(e)
    const leftEye = nodes.LeftEye
    const rightEye = nodes.RightEye
    if (leftEye && rightEye) {
      const degrees = {
        x: (coords.x / window.innerWidth) * 90,
        y: (coords.y / window.innerHeight) * 90 - 45,
      }
      const max = {
        y: degrees.y > 20 ? 20 : degrees.y < -10 ? -10 : degrees.y,
        x: degrees.x > 60 ? 60 : degrees.x < 20 ? 20 : degrees.x,
      }
      const x = -1.54 + THREE.MathUtils.degToRad(max.y)
      const z = 2.5 + THREE.MathUtils.degToRad(max.x)
      motionX.set(x)
      motionZ.set(z)
    }
  }

  useFrame(() => {
    if (nodes.LeftEye && nodes.RightEye) {
      nodes.LeftEye.rotation.x = motionX.get()
      nodes.LeftEye.rotation.z = motionZ.get()
      nodes.RightEye.rotation.x = motionX.get()
      nodes.RightEye.rotation.z = motionZ.get()
    }
  })

  useEffect(() => {
    if (isSelection) {
      document.addEventListener('mousemove', (e) => eyesFollowMouse(e, nodes))
      return () => {
        document.removeEventListener('mousemove', (e) =>
          eyesFollowMouse(e, nodes)
        )
      }
    }
    if (!isSelection) {
      document.removeEventListener('mousemove', (e) =>
        eyesFollowMouse(e, nodes)
      )
    }
  }, [isSelection])
}
