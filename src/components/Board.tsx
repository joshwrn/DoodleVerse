import React, { useEffect, useState } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useDrawStore } from '@/state/movement/draw'

const ratio = 20
const canvasResolution = {
  width: 3000,
  height: 1000,
}
const boardDimensions = {
  width: canvasResolution.width / ratio,
  height: canvasResolution.height / ratio,
}

export const Board = ({ domNode }: { domNode: HTMLCanvasElement | null }) => {
  const textureRef = React.useRef<THREE.CanvasTexture>(null)
  const { setDistance, mouseDown } = useDrawStore((s) => ({
    setDistance: s.setDistance,
    mouseDown: s.mouseDown,
  }))
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

  const lastPosition = React.useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  })

  const onLeave = () => {
    lastPosition.current = {
      x: null,
      y: null,
    }
    setDistance(null)
  }

  const draw = (e: ThreeEvent<PointerEvent>) => {
    if (domNode) {
      const ctx = domNode.getContext(`2d`)
      if (ctx) {
        if (e.distance > 30) {
          onLeave()
          return
        }
        const position = {
          x: e.point.x,
          y: e.point.y,
          z: e.point.z,
        }
        setPos(position)
        setDistance(e.distance)

        if (!mouseDown) {
          lastPosition.current = {
            x: null,
            y: null,
          }
          return
        }
        const x2d = e.point.x * ratio
        const y2d = e.point.y * ratio
        const currentPosition = {
          x: canvasResolution.width - x2d,
          y: canvasResolution.height - y2d,
        }
        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.lineCap = `round`
        ctx.strokeStyle = `#ee00ff`
        ctx.moveTo(
          lastPosition.current.x ?? currentPosition.x,
          lastPosition.current.y ?? currentPosition.y
        )
        lastPosition.current = currentPosition
        ctx.lineTo(currentPosition.x, currentPosition.y)
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
        onPointerLeave={onLeave}
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
