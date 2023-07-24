/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 -t public/avatar/male2.glb
*/

import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations, PointerLockControls } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame, useThree } from '@react-three/fiber'
import {
  useMovementControls,
  useMovementStore,
} from '@/state/movement/controls'

type GLTFResult = GLTF & {
  nodes: {
    Wolf3D_Avatar: THREE.SkinnedMesh
    Hips: THREE.Bone
  }
  materials: {
    Wolf3D_Avatar: THREE.MeshStandardMaterial
  }
}

type ActionName =
  'Armature.001|F_Standing_Idle_001|F_Standing_Idle_001:BaseAnimat'
type GLTFActions = Record<ActionName, THREE.AnimationAction>

// if (!outer.current) return
// // copy camera position to group
// outer.current!.position.copy(state.camera.position)
// // make the outer look in the same direction the camera is looking
// const rotationAmount = state.camera.rotation.y * -1
// console.log(rotationAmount)

// outer.current.lookAt(state.camera.position)
// outer.current.rotation.y = rotationAmount

let walkDirection = new THREE.Vector3()
let rotateAngle = new THREE.Vector3(0, 1, 0)
let rotateQuaternion = new THREE.Quaternion()
let cameraTarget = new THREE.Vector3()

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
  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4 // w + a
    } else if (right) {
      directionOffset = -Math.PI / 4 // w + d
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2 // s + a
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2 // s + d
    } else {
      directionOffset = Math.PI // s
    }
  } else if (left) {
    directionOffset = Math.PI / 2 // a
  } else if (right) {
    directionOffset = -Math.PI / 2 // d
  }
  return directionOffset
}

export function Male2(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null)
  const outer = useRef<THREE.Group>(null)
  const model = useGLTF('/avatar/male2.glb') as GLTFResult
  const { nodes, materials, animations, scene } = model
  const { actions } = useAnimations<THREE.AnimationClip>(animations, group)
  const { forward, backward, left, right } = useMovementStore((s) => s)
  useMovementControls()
  const controlsRef = useRef<any>(null)
  const cameraPosRef = useRef<THREE.Group>(null)

  useEffect(() => {
    actions['Armature.001|F_Standing_Idle_001|F_Standing_Idle_001:BaseAnimat']
      ?.reset()
      .fadeIn(0.5)
      .play()
  }, [actions])
  const { camera } = useThree()

  const updateCameraTarget = (moveX: number, moveZ: number) => {
    // move camera
    cameraTarget.x += moveX
    cameraTarget.z += moveZ

    // update camera target
    cameraTarget.x = scene.position.x
    cameraTarget.y = scene.position.y
    cameraTarget.z = scene.position.z
    // if (controlsRef.current) {
    //   controlsRef.current.target = cameraTarget
    // }
    cameraPosRef.current?.getWorldPosition(camera.position)
  }

  useFrame((state, delta) => {
    if (forward || backward || left || right) {
      // calculate towards camera direction
      let angleYCameraDirection = Math.atan2(
        camera.position.x - outer.current!.position.x,
        camera.position.z - outer.current!.position.z
      )

      // diagonal movement angle offset
      let newDirectionOffset = directionOffset({
        forward,
        backward,
        left,
        right,
      })

      // rotate model
      rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionOffset
      )
      outer.current!.quaternion.rotateTowards(rotateQuaternion, 0.05)

      console.log(camera)
      // calculate direction
      camera.getWorldDirection(walkDirection)
      walkDirection.y = 0
      walkDirection.normalize()
      walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset)

      // run / walk velocity
      const velocity = 50

      // move model & camera
      const moveX = walkDirection.x * velocity * delta
      const moveZ = walkDirection.z * velocity * delta
      outer.current!.position.x += moveX
      outer.current!.position.z += moveZ
      updateCameraTarget(moveX, moveZ)
    }
  })

  return (
    <>
      <group ref={outer}>
        <group ref={cameraPosRef} position={[0, 13, 0]} />
        <group
          ref={group}
          {...props}
          dispose={null}
          position={[0, -13, 5]}
          rotation={[0, 0, 0]}
          scale={13}
        >
          <group name="Scene">
            <group
              name="Armature001"
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            >
              <primitive object={nodes.Hips} />
              <skinnedMesh
                name="Wolf3D_Avatar"
                geometry={nodes.Wolf3D_Avatar.geometry}
                material={materials.Wolf3D_Avatar}
                skeleton={nodes.Wolf3D_Avatar.skeleton}
                morphTargetDictionary={
                  nodes.Wolf3D_Avatar.morphTargetDictionary
                }
                morphTargetInfluences={
                  nodes.Wolf3D_Avatar.morphTargetInfluences
                }
              />
            </group>
          </group>
          g
        </group>
      </group>
    </>
  )
}

useGLTF.preload('/avatar/male2.glb')
