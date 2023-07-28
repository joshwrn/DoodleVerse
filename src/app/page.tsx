'use client'
import { useRef, useState } from 'react'
import {
  Environment,
  MeshReflectorMaterial,
  PointerLockControls,
} from '@react-three/drei'

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
import { Scene } from '@/components/Start/Scene'
import { usePlayerStore } from '@/state/settings/player'
import { SelectOverlay } from '@/components/Start/SelectOverlay'
import { useSettingsStore } from '@/state/settings/settings'

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
  const { agreedToTerms, avatarSelected } = useSettingsStore((s) => ({
    agreedToTerms: s.agreedToTerms,
    avatarSelected: s.avatarSelected,
  }))

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
          position: [0, 0, 0],
          rotation: [0, 0, 0],
        }}
        id="canvas"
        ref={canvasRef}
      >
        <Environment
          files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']}
          path="skybox/"
        />
        {!avatarSelected && <Scene />}
        {agreedToTerms && (
          <>
            <FpsCamera canvasRef={canvasRef} />
            <Physics gravity={[0, -50, 0]}>
              <Board domNode={domNode} />
              <Ground />
              <Roof />
              <Male2 />
            </Physics>
          </>
        )}
        <ambientLight intensity={0.2} />
        <GradientLighting />
      </Canvas>
      {!agreedToTerms && <SelectOverlay />}
      {agreedToTerms && (
        <>
          <Crosshair />
          <Hud />
          <SettingsOverlay setDomNode={setDomNode} />
        </>
      )}
    </CanvasContainer>
  )
}
