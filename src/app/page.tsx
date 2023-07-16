'use client'
import { useCallback, useState } from 'react'
import { PointerLockControls, Sky, Environment } from '@react-three/drei'
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
        camera={{ fov: 80, position: [50, 15, 0] }}
      >
        {/* <Environment preset="park" /> */}
        <color attach="background" args={[`white`]} />
        {!settingsOpen && <PointerLockControls enabled={!settingsOpen} />}
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
        />
        <Board domNode={domNode} />
        <Physics gravity={[0, -50, 0]}>
          <Player />
          <Ground />
        </Physics>
        <ambientLight intensity={0.8} />
        <pointLight
          color="white"
          castShadow
          position={[0, 10, 50]}
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
