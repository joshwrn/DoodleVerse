/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 -t public/roof/roof.glb
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cube_roof_ground_material_0002: THREE.Mesh
    Cube007_guards_material_0002: THREE.Mesh
    Cube015_guards_material_0001: THREE.Mesh
    Cube016_guards_material_0001: THREE.Mesh
    Cube_roof_ground_material_0001: THREE.Mesh
    Cube007_guards_material_0001: THREE.Mesh
  }
  materials: {
    ['roof_ground_material.002']: THREE.MeshStandardMaterial
    ['guards_material.002']: THREE.MeshStandardMaterial
    ['roof_ground_material.004']: THREE.MeshStandardMaterial
    ['guards_material.004']: THREE.MeshStandardMaterial
  }
}

const Mat = () => (
  <meshStandardMaterial
    attach="material"
    color="#4d4d4d"
    roughness={0}
    metalness={0}
  />
)

export function Roof(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/roof/roof.glb') as GLTFResult
  return (
    <group
      {...props}
      dispose={null}
      position={[78, -7, -20]}
      rotation={[0, Math.PI * 1.5, 0]}
      scale={7}
    >
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.01}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            geometry={nodes.Cube_roof_ground_material_0002.geometry}
            material={materials['roof_ground_material.002']}
            position={[0, 0, 40.86]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
            receiveShadow
            castShadow
          >
            <Mat />
          </mesh>
          <mesh
            geometry={nodes.Cube007_guards_material_0002.geometry}
            position={[579.56, 91, -858.16]}
            rotation={[-Math.PI / 2, 0, -Math.PI]}
            scale={[115.67, 84.27, 115.67]}
            receiveShadow
            castShadow
          >
            <Mat />
          </mesh>
          <mesh
            geometry={nodes.Cube015_guards_material_0001.geometry}
            position={[444.9, 91, -1033.93]}
            rotation={[Math.PI / 2, 0, -Math.PI / 2]}
            scale={[-115.67, -84.27, -115.67]}
            receiveShadow
            castShadow
          >
            <Mat />
          </mesh>
          <mesh
            geometry={nodes.Cube016_guards_material_0001.geometry}
            position={[444.9, 91, 1120.48]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            scale={[115.67, 84.27, 115.67]}
            receiveShadow
            castShadow
          >
            <Mat />
          </mesh>
        </group>
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={-0.01}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            geometry={nodes.Cube_roof_ground_material_0001.geometry}
            position={[0, 0, 40.86]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
            receiveShadow
            castShadow
          >
            <Mat />
          </mesh>
        </group>
      </group>
      <group rotation={[Math.PI / 2, 0, 0]} scale={-0.01}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            geometry={nodes.Cube007_guards_material_0001.geometry}
            position={[579.56, 91, -858.16]}
            rotation={[-Math.PI / 2, 0, -Math.PI]}
            scale={[115.67, 84.27, 115.67]}
            receiveShadow
            castShadow
          >
            <Mat />
          </mesh>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/roof/roof.glb')
