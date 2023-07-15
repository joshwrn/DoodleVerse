'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { PointerLockControls, Reflector, Sky, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import styled from 'styled-components'

const CanvasContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
`

const Drawing = styled.div`
  border: 1px solid black;
  color: red;
  canvas {
    border: 1px solid black;
    width: 1000px;
    height: 500px;
  }
`

const DrawingCanvas = () => {
  const [domNode, setDomNode] = useState<HTMLCanvasElement | null>(null)
  const onRefChange = useCallback((node: HTMLCanvasElement) => {
    setDomNode(node)
  }, [])
  const textureRef = React.useRef<THREE.CanvasTexture>(null)

  useEffect(() => {
    if (domNode) {
      const ctx = domNode.getContext(`2d`)
      if (ctx) {
        ctx.fillStyle = `rgb(200, 0, 0)`
        ctx.fillRect(10, 10, 50, 50)
      }
    }
  }, [domNode])

  useFrame(() => {
    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  })
  return (
    <>
      <mesh scale={[100, 30, 1]} position={[0, 0, 50]} receiveShadow castShadow>
        <boxGeometry />
        {/* <meshStandardMaterial
      color="rgb(255, 255, 255)"
      metalness={0.3}
      roughness={0.5}
      attach="material"
      envMapIntensity={0.2}
    /> */}

        <meshBasicMaterial>
          <canvasTexture attach="map" ref={textureRef} image={domNode} />
        </meshBasicMaterial>
      </mesh>
      <Html
        as="div" // Wrapping element (default: 'div')
        rotation={[0, 0, 0]}
        position={[0, 0, 35]}
        occlude
      >
        <Drawing>
          hello
          <canvas ref={onRefChange} />
        </Drawing>
      </Html>
    </>
  )
}

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
        <DrawingCanvas />
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
