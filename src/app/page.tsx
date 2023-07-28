'use client'
import { useRef, useState } from 'react'
import { Environment, MeshReflectorMaterial } from '@react-three/drei'

import { Canvas } from '@react-three/fiber'
import styled from 'styled-components'
import { Physics } from '@react-three/cannon'
import { Ground } from '@/components/Roof/Ground'
import { Board } from '@/components/Board'
import { Crosshair } from '@/components/Overlay/Crosshair'
import { useMouseDown } from '@/state/settings/draw'
import { SettingsOverlay } from '@/components/Overlay/SettingsOverlay'
import { SkyBox } from '@/components/Skybox'
import { useSockets } from '@/server/clientSocket'
import { Roof } from '@/components/Roof/Roof'
import { Hud } from '@/components/Overlay/Hud'
import { Male2 } from '@/components/Avatar/Male2'
import { FpsCamera } from '@/components/FpsCamera'
import { Woman } from '@/components/Avatar/Female'
import { GradientLighting, Gradients } from '@/components/Background'

const CanvasContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #0c0d19;
  position: relative;
  > canvas {
    position: absolute;
    z-index: 5;
  }
`

export default function Home() {
  const [domNode, setDomNode] = useState<HTMLCanvasElement | null>(null)
  useMouseDown()
  useSockets({ domNode })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <CanvasContainer>
      <Gradients />
      <Canvas
        shadows
        gl={{
          powerPreference: 'high-performance',
          stencil: false,
          alpha: true,
        }}
        camera={{
          fov: 80,
        }}
        id="canvas"
        ref={canvasRef}
      >
        <FpsCamera canvasRef={canvasRef} />
        {/* <SkyBox /> */}
        <Environment
          files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']}
          path="skybox/"
        />

        <Physics gravity={[0, -50, 0]}>
          <Board domNode={domNode} />
          <Ground />
          <Roof />
          {/* <Player /> */}
          <Male2 />
          <Woman />
        </Physics>
        <ambientLight intensity={0.2} />
        <GradientLighting />
      </Canvas>
      <Crosshair />
      <Hud />
      <SettingsOverlay setDomNode={setDomNode} />
    </CanvasContainer>
  )
}

const Floor = () => (
  <>
    <mesh
      position={[75, -8, -20]}
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[180, 200]} />
      <shadowMaterial transparent opacity={0.25} />
      {/* <MeshReflectorMaterial
        blur={[500, 40]}
        resolution={1024}
        mixBlur={1}
        mixStrength={100}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#202020"
        metalness={0.8}
        mirror={0.5}
      /> */}
    </mesh>
  </>
)
