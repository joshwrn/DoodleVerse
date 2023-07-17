'use client'
import { useCallback, useState } from 'react'
import { PointerLockControls, Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import styled from 'styled-components'
import { Physics } from '@react-three/cannon'
import Player from '@/components/Player'
import { Ground } from '@/components/Ground'
import { Board } from '@/components/Board'
import { Crosshair } from '@/components/Crosshair'
import { useMouseDown } from '@/state/movement/draw'
import { SettingsOverlay } from '@/components/SettingsOverlay'
import { useSettingsStore } from '@/state/settings/settings'
import { SkyBox } from '@/components/Skybox'
import { Railing } from '@/components/Railing'

const CanvasContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
`

const Drawing = styled.div`
  border: 1px solid black;
  color: red;
  position: absolute;
  pointer-events: none;
  z-index: -1;
  canvas {
    border: 1px solid black;
    width: 300px;
    height: 150px;
  }
`

export default function Home() {
  const [domNode, setDomNode] = useState<HTMLCanvasElement | null>(null)
  const onRefChange = useCallback((node: HTMLCanvasElement) => {
    setDomNode(node)
  }, [])
  useMouseDown()
  const { settingsOpen } = useSettingsStore((s) => ({
    settingsOpen: s.settingsOpen,
  }))
  return (
    <CanvasContainer>
      <Canvas
        shadows
        gl={{ alpha: false }}
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
      <Drawing>
        <canvas ref={onRefChange} />
      </Drawing>
      <SettingsOverlay />
    </CanvasContainer>
  )
}
