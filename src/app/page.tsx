'use client'
import { useCallback, useEffect, useState } from 'react'
import { PointerLockControls, Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import styled from 'styled-components'
import { Debug, Physics } from '@react-three/cannon'
import Player from '@/components/Player'
import { Ground } from '@/components/Roof/Ground'
import { Board } from '@/components/Board'
import { Crosshair } from '@/components/Crosshair'
import { useMouseDown } from '@/state/settings/draw'
import { SettingsOverlay } from '@/components/SettingsOverlay'
import { useSettingsStore } from '@/state/settings/settings'
import { SkyBox } from '@/components/Skybox'
import { useSockets } from '@/server/socket'
import { Roof } from '@/components/Roof/Roof'
import { motion } from 'framer-motion'
import { Hud } from '@/components/Hud'

const CanvasContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  > canvas {
    position: absolute;
    z-index: 1;
  }
`

const Drawing = styled(motion.div)<{ show: boolean }>`
  position: absolute;
  pointer-events: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: ${({ show }) => (show ? 1 : -100)};
  width: fit-content;
  border: 1px solid red;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid black;
  canvas {
    display: block;
    width: 400px;
  }
`

export default function Home() {
  const [domNode, setDomNode] = useState<HTMLCanvasElement | null>(null)
  const onRefChange = useCallback((node: HTMLCanvasElement) => {
    setDomNode(node)
  }, [])
  useMouseDown()
  useSockets({ domNode })
  const { settingsOpen } = useSettingsStore((s) => ({
    settingsOpen: s.settingsOpen,
  }))
  return (
    <CanvasContainer>
      <Canvas
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: false,
          alpha: false,
        }}
        camera={{
          fov: 80,
          position: [150, 15, 0],
          rotation: [0, Math.PI, 0],
        }}
      >
        <SkyBox />
        <Environment
          files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']}
          path="skybox/"
        />
        {!settingsOpen && <PointerLockControls enabled={!settingsOpen} />}
        <Physics gravity={[0, -50, 0]}>
          <Board domNode={domNode} />
          <Ground />
          <Roof />
          <Player />
        </Physics>

        <ambientLight intensity={0.2} />
        <pointLight
          color="#ffffff"
          castShadow
          position={[100, 30, 20]}
          intensity={2}
        />
      </Canvas>
      <Crosshair />
      <Hud />
      <SettingsOverlay />
      <Drawing show={settingsOpen} animate={{ opacity: settingsOpen ? 1 : 0 }}>
        <canvas ref={onRefChange} />
      </Drawing>
    </CanvasContainer>
  )
}
