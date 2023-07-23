'use client'
import { useEffect, useRef, useState } from 'react'
import { PointerLockControls, Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import styled from 'styled-components'
import { Physics } from '@react-three/cannon'
import Player from '@/components/Player'
import { Ground } from '@/components/Roof/Ground'
import { Board } from '@/components/Board'
import { Crosshair } from '@/components/Crosshair'
import { useMouseDown } from '@/state/settings/draw'
import { SettingsOverlay } from '@/components/SettingsOverlay'
import { useSettingsStore } from '@/state/settings/settings'
import { SkyBox } from '@/components/Skybox'
import { useSockets } from '@/server/clientSocket'
import { Roof } from '@/components/Roof/Roof'
import { Hud } from '@/components/Hud'
import { Male } from '@/components/Male'

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
  const { settingsOpen } = useSettingsStore((s) => ({
    settingsOpen: s.settingsOpen,
  }))
  const lockRef = useRef<any>(null)
  useEffect(() => {
    if (!lockRef.current) return
    if (settingsOpen) {
      lockRef.current.unlock()
    }
    if (!settingsOpen) {
      lockRef.current.lock()
    }
  }, [settingsOpen])
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
          position: [150, 15, 0],
          rotation: [0, Math.PI, 0],
        }}
      >
        <SkyBox />
        <Environment
          files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']}
          path="skybox/"
        />
        <PointerLockControls ref={lockRef} />
        <Physics gravity={[0, -50, 0]}>
          <Board domNode={domNode} />
          <Ground />
          <Roof />
          <Player />
          <Male />
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
