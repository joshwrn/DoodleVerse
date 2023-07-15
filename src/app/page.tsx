'use client'

import { PointerLockControls, Reflector, Sky } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import styled from 'styled-components'

const CanvasContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
`

export default function Home() {
  return (
    <CanvasContainer>
      <Canvas shadows gl={{ alpha: false }} camera={{ fov: 80 }}>
        <color attach="background" args={[`white`]} />
        <PointerLockControls />
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
        />
        <mesh
          scale={[100, 30, 1]}
          position={[0, 0, 50]}
          receiveShadow
          castShadow
        >
          <boxGeometry />
          <meshStandardMaterial
            color="rgb(255, 255, 255)"
            metalness={0.3}
            roughness={0.5}
            attach="material"
            envMapIntensity={0.2}
          />
        </mesh>
        <ambientLight intensity={0.8} />
        <pointLight
          color="white"
          castShadow
          position={[0, 10, 50]}
          intensity={2}
        />
        <mesh rotation={[-3.14 / 2, 0, 0]} position={[0, -15, 0]} receiveShadow>
          <planeGeometry args={[300, 300]} />
          <meshStandardMaterial
            color="rgb(255, 255, 255)"
            metalness={0}
            roughness={0}
            attach="material"
          />
        </mesh>
      </Canvas>
    </CanvasContainer>
  )
}
