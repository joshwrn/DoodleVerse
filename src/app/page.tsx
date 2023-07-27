'use client'
import { useRef, useState } from 'react'
import { Environment } from '@react-three/drei'

import { Canvas } from '@react-three/fiber'
import styled from 'styled-components'
import { Physics } from '@react-three/cannon'
import { Ground } from '@/components/Roof/Ground'
import { Board } from '@/components/Board'
import { Crosshair } from '@/components/Crosshair'
import { useMouseDown } from '@/state/settings/draw'
import { SettingsOverlay } from '@/components/SettingsOverlay'
import { SkyBox } from '@/components/Skybox'
import { useSockets } from '@/server/clientSocket'
import { Roof } from '@/components/Roof/Roof'
import { Hud } from '@/components/Hud'
import { Male2 } from '@/components/Male2'
import { FpsCamera } from '@/components/FpsCamera'

const CanvasContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  > canvas {
    position: absolute;
    z-index: 1;
  }
`

export default function Home() {
  const [domNode, setDomNode] = useState<HTMLCanvasElement | null>(null)
  useMouseDown()
  useSockets({ domNode })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <CanvasContainer>
      <Canvas
        shadows
        gl={{
          powerPreference: 'high-performance',
          stencil: false,
          alpha: false,
        }}
        camera={{
          fov: 80,
        }}
        id="canvas"
        ref={canvasRef}
      >
        <FpsCamera canvasRef={canvasRef} />
        <SkyBox />
        <Environment
          files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']}
          path="skybox/"
        />
        {/* <PointerLockControls ref={lockRef} /> */}
        <Physics gravity={[0, -50, 0]}>
          <Board domNode={domNode} />
          <Ground />
          <Roof />
          {/* <Player /> */}
          <Male2 />
        </Physics>
        <ambientLight intensity={0.2} />
        <pointLight
          color="#ffffff"
          castShadow
          position={[100, 80, 20]}
          intensity={1.5}
        />
      </Canvas>
      <Crosshair />
      <Hud />
      <SettingsOverlay setDomNode={setDomNode} />
    </CanvasContainer>
  )
}
