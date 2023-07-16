import React, { useEffect } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { useDrawStore } from '@/state/movement/draw'
import { MAX_DISTANCE_FROM_BOARD } from '@/state/constants'
import { useBox } from '@react-three/cannon'
import { useAddPhysicsObject } from '@/hooks/useAddPhysicsObject'

export const CANVAS_TO_BOARD_RATIO = 20
const canvasResolution = {
  width: 3000,
  height: 1000,
}
const boardDimensions = {
  width: canvasResolution.width / CANVAS_TO_BOARD_RATIO,
  height: canvasResolution.height / CANVAS_TO_BOARD_RATIO,
}

const convertToCanvasCoords = ({ point }: { point: Vector3 }) => {
  const x2d = point.x * CANVAS_TO_BOARD_RATIO
  const y2d = point.y * CANVAS_TO_BOARD_RATIO
  const currentPosition = {
    x: canvasResolution.width - x2d,
    y: canvasResolution.height - y2d,
  }
  return currentPosition
}

export const Board = ({ domNode }: { domNode: HTMLCanvasElement | null }) => {
  const [ref] = useBox<Mesh>(() => ({
    position: [boardDimensions.width / 2, boardDimensions.height / 2, 40],
    args: [boardDimensions.width, boardDimensions.height, 1],
    type: `Static`,
  }))

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
        receiveShadow
        castShadow
        ref={ref}
      >
        <boxGeometry />
        <meshStandardMaterial metalness={0} roughness={0.6}>
          <canvasTexture attach="map" ref={textureRef} image={domNode} />
        </meshStandardMaterial>
      </mesh>
    </>
  )
}
