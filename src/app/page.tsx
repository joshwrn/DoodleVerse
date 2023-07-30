'use client'
import { useRef, useState } from 'react'
import { Environment, Loader } from '@react-three/drei'

import { Canvas } from '@react-three/fiber'
import styled from 'styled-components'
import { Debug, Physics } from '@react-three/cannon'
import { Ground } from '@/components/Platform/Ground'
import { Board } from '@/components/Board'
import { Crosshair } from '@/components/Overlay/Crosshair'
import { useMouseDown } from '@/state/settings/draw'
import { SettingsOverlay } from '@/components/Overlay/SettingsOverlay'
import { useSockets } from '@/server/clientSocket'
import { Railing } from '@/components/Platform/Railing'
import { Hud } from '@/components/Overlay/Hud'
import { Player } from '@/components/Player'
import { FpsCamera } from '@/components/FpsCamera'
import { GradientLighting, Gradients } from '@/components/Background'
import { AvatarSelection } from '@/components/Start/AvatarSelection'
import { SelectOverlay } from '@/components/Start/SelectOverlay'
import { useSettingsStore } from '@/state/settings/settings'
import { OtherPlayers } from '@/components/OtherPlayers'

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
  const [canvasNode, setCanvasNode] = useState<HTMLCanvasElement | null>(null)
  useMouseDown()
  useSockets({ canvasNode: canvasNode })
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
          position: [0, 12, 0],
          rotation: [0, 0, 0],
        }}
        id="canvas"
        ref={canvasRef}
      >
        <Environment
          files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']}
          path="skybox/"
        />
        {!avatarSelected && <AvatarSelection />}
        {agreedToTerms && (
          <>
            <FpsCamera canvasRef={canvasRef} />
            <Physics gravity={[0, -50, 0]}>
              <Board canvasNode={canvasNode} />
              <Ground />
              <Railing />
              <Player />
            </Physics>
          </>
        )}
        <OtherPlayers />
        <ambientLight intensity={0.2} />
        <GradientLighting />
      </Canvas>
      {!agreedToTerms && <SelectOverlay />}
      {agreedToTerms && (
        <>
          <Crosshair />
          <Hud />
        </>
      )}
      <SettingsOverlay setCanvasNode={setCanvasNode} />
      <Loader
        containerStyles={{
          background: 'transparent',
        }}
        dataStyles={{
          opacity: 0,
        }}
      />
    </CanvasContainer>
  )
}
