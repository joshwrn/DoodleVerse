import type { FC } from 'react'
import React from 'react'
import { MeshTransmissionMaterial } from '@react-three/drei'

import styled from 'styled-components'
import * as THREE from 'three'

/* <MeshTransmissionMaterial
        envMapIntensity={0.5}
        background={new THREE.Color('white')}
        transmission={1}
        roughness={0}
        thickness={0}
        ior={1.38}
        color={'#ffffff'}
        clearcoat={0.1}
        chromaticAberration={0.1}
        distortion={0}
        backside={true}
        samples={3}
        resolution={2048}
        distortionScale={0.3}
        temporalDistortion={0.5}
      /> */

export const Railing: FC = () => {
  return (
    <mesh scale={[100, 2, 1]} position={[50, 1, 0]}>
      <boxGeometry />
      <meshPhysicalMaterial
        color="rgb(156, 156, 156)"
        metalness={0}
        roughness={6}
        attach="material"
      />
    </mesh>
  )
}
