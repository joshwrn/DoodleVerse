'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  PointerLockControls,
  Reflector,
  Sky,
  Html,
  Environment,
} from '@react-three/drei'
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber'
import styled from 'styled-components'
import { Physics, usePlane } from '@react-three/cannon'
import { Mesh } from 'three'
import { create } from 'zustand'
import Player from '@/components/Player'

const CanvasContainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
`

const Drawing = styled.div`
  border: 1px solid black;
  color: red;
  position: absolute;
  z-index: 100;
  pointer-events: none;
  canvas {
    border: 1px solid black;
    width: 300px;
    height: 150px;
  }
`

const canvasResolution = {
  width: 3000,
  height: 500,
}
const boardDimensions = {
  width: canvasResolution.width / 10,
  height: canvasResolution.height / 10,
}

const DrawingCanvas = ({ domNode }: { domNode: HTMLCanvasElement | null }) => {
  const textureRef = React.useRef<THREE.CanvasTexture>(null)
  const [pos, setPos] = useState<{
    x: number
    y: number
    z: number
  }>({
    x: 0,
    y: 0,
    z: 0,
  })

  useEffect(() => {
    if (domNode) {
      const ctx = domNode.getContext(`2d`)
      if (ctx) {
        domNode.width = canvasResolution.width
        domNode.height = canvasResolution.height
        ctx.fillStyle = `white`
        ctx.fillRect(0, 0, canvasResolution.width, canvasResolution.height)
        ctx.fillStyle = `rgb(200, 0, 0)`
        ctx.fillRect(0, 0, 50, 50)
      }
    }
  }, [domNode])

  useFrame(() => {
    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  })

  const draw = (e: ThreeEvent<PointerEvent>) => {
    if (domNode) {
      const ctx = domNode.getContext(`2d`)
      if (ctx) {
        const position = {
          x: e.point.x,
          y: e.point.y,
          z: e.point.z,
        }
        setPos(position)
        const x2d = e.point.x * 10
        const y2d = e.point.y * 10
        const coord = {
          x: canvasResolution.width - x2d,
          y: canvasResolution.height - y2d,
        }

        console.log(e.distance, e.point.x, e.point.y, e.point.z)
        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.lineCap = `round`
        ctx.strokeStyle = `#ee00ff`
        ctx.moveTo(coord.x, coord.y)
        // reposition(event)
        ctx.lineTo(coord.x, coord.y)
        ctx.stroke()
      }
    }
  }

  return (
    <>
      {/* <mesh position={[pos.x, pos.y, pos.z]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh> */}
      <mesh
        scale={[boardDimensions.width, boardDimensions.height, 1]}
        onPointerMove={draw}
        position={[boardDimensions.width / 2, boardDimensions.height / 2, 40]}
        receiveShadow
        castShadow
      >
        <boxGeometry />
        <meshStandardMaterial metalness={0.2} roughness={0.1}>
          <canvasTexture attach="map" ref={textureRef} image={domNode} />
        </meshStandardMaterial>
      </mesh>
    </>
  )
}

export default function Home() {
  const [domNode, setDomNode] = useState<HTMLCanvasElement | null>(null)
  const onRefChange = useCallback((node: HTMLCanvasElement) => {
    setDomNode(node)
  }, [])
  return (
    <CanvasContainer>
      <Drawing>
        <canvas ref={onRefChange} />
      </Drawing>
      <Canvas
        shadows
        gl={{ alpha: false }}
        camera={{ fov: 80, position: [50, 15, 0] }}
      >
        <Environment preset="park" />
        <color attach="background" args={[`white`]} />
        <PointerLockControls />
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0}
          azimuth={0.25}
        />
        <DrawingCanvas domNode={domNode} />
        <Physics>
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
    </CanvasContainer>
  )
}

export const useObjectStore = create<{
  objects: Mesh[]
  addObject: (object: Mesh) => void
}>((set) => ({
  objects: [],
  addObject: (object) => set((s) => ({ objects: [...s.objects, object] })),
}))

export const Ground = (): React.ReactElement => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [100, 0, 0],
  }))
  const { addObject } = useObjectStore()

  useEffect(() => {
    if (!ref.current) return
    addObject(ref.current)
  }, [ref])

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial
        color="rgb(48, 74, 52)"
        metalness={0}
        roughness={6}
        attach="material"
      />
    </mesh>
  )
}
