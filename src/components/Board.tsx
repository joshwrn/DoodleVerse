import React, { useEffect } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useDrawStore } from '@/state/movement/draw'
import { MAX_DISTANCE_FROM_BOARD } from '@/state/constants'

const ratio = 20
const canvasResolution = {
  width: 3000,
  height: 1000,
}
const boardDimensions = {
  width: canvasResolution.width / ratio,
  height: canvasResolution.height / ratio,
}

const convertToCanvasCoords = ({ point }: { point: Vector3 }) => {
  const x2d = point.x * ratio
  const y2d = point.y * ratio
  const currentPosition = {
    x: canvasResolution.width - x2d,
    y: canvasResolution.height - y2d,
  }
  return currentPosition
}

export const Board = ({ domNode }: { domNode: HTMLCanvasElement | null }) => {
  const textureRef = React.useRef<THREE.CanvasTexture>(null)
  const { setDistance, mouseDown, color, brushSize } = useDrawStore((s) => ({
    setDistance: s.setDistance,
    mouseDown: s.mouseDown,
    color: s.color,
    brushSize: s.brushSize,
  }))

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

  const resetLastPosition = () => {
    lastPosition.current = {
      x: null,
      y: null,
    }
  }

  const onLeave = () => {
    resetLastPosition()
    setDistance(null)
  }

  const draw = (e: ThreeEvent<PointerEvent>) => {
    if (domNode) {
      const ctx = domNode.getContext(`2d`)
      if (ctx) {
        if (e.distance > MAX_DISTANCE_FROM_BOARD) {
          onLeave()
          return
        }
        setDistance(e.distance)

        if (!mouseDown) {
          resetLastPosition()
          return
        }
        const currentPosition = convertToCanvasCoords({
          point: e.point,
        })
        ctx.beginPath()
        ctx.lineWidth = brushSize
        ctx.lineCap = `round`
        ctx.strokeStyle = color
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

  const drawDot = (e: ThreeEvent<PointerEvent>) => {
    if (domNode) {
      const ctx = domNode.getContext(`2d`)
      if (ctx) {
        if (e.distance > MAX_DISTANCE_FROM_BOARD) {
          onLeave()
          return
        }
        setDistance(e.distance)
        const currentPosition = convertToCanvasCoords({
          point: e.point,
        })
        ctx.beginPath()
        ctx.lineWidth = brushSize
        ctx.lineCap = `round`
        ctx.strokeStyle = color
        ctx.moveTo(currentPosition.x, currentPosition.y)
        ctx.lineTo(currentPosition.x, currentPosition.y)
        ctx.stroke()
      }
    }
  }
  return (
    <>
      <mesh
        scale={[boardDimensions.width, boardDimensions.height, 1]}
        onPointerMove={draw}
        onPointerLeave={onLeave}
        onPointerDown={drawDot}
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
