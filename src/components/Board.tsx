import React, { useEffect } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { useDrawStore } from '@/state/settings/draw'
import {
  BOARD_DIMENSIONS,
  CANVAS_RESOLUTION,
  CANVAS_TO_BOARD_RATIO,
  MAX_DISTANCE_FROM_BOARD,
} from '@/state/constants'
import { useBox } from '@react-three/cannon'
import { useSocketState } from '@/server/clientSocket'
import { usePlayerStore } from '@/state/settings/player'
import { useImageLoadedStore } from '@/server/events/client/loadCanvas'

const convertVector3ToCanvasCoords = ({ point }: { point: Vector3 }) => {
  const x2d = point.x * CANVAS_TO_BOARD_RATIO
  const y2d = point.y * CANVAS_TO_BOARD_RATIO
  const currentPosition = {
    x: CANVAS_RESOLUTION.width - x2d,
    y: CANVAS_RESOLUTION.height - y2d,
  }
  return currentPosition
}

export const Board = ({ domNode }: { domNode: HTMLCanvasElement | null }) => {
  const [ref] = useBox<Mesh>(() => ({
    position: [BOARD_DIMENSIONS.width / 2, BOARD_DIMENSIONS.height / 2, 40],
    args: [BOARD_DIMENSIONS.width, BOARD_DIMENSIONS.height, 1],
    type: `Static`,
  }))

  const textureRef = React.useRef<THREE.CanvasTexture>(null)
  const { setDistance, mouseDown, color, brushSize } = useDrawStore((s) => ({
    setDistance: s.setDistance,
    mouseDown: s.mouseDown,
    color: s.color,
    brushSize: s.brushSize,
  }))
  const { userId } = usePlayerStore((s) => ({
    userId: s.userId,
  }))
  const { imageLoaded } = useImageLoadedStore((s) => ({
    imageLoaded: s.imageLoaded,
  }))

  const socket = useSocketState((state) => state.socket)

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

  const checksBeforeDrawing = (e: ThreeEvent<PointerEvent>, stroke: string) => {
    const ctx = domNode?.getContext(`2d`)
    if (!ctx) return null
    if (e.distance > MAX_DISTANCE_FROM_BOARD) {
      onLeave()
      return null
    }
    setDistance(e.distance)
    if (!mouseDown && stroke === 'line') {
      resetLastPosition()
      return null
    }
    const currentPosition = convertVector3ToCanvasCoords({
      point: e.point,
    })
    return { ctx, currentPosition }
  }

  const drawLine = (e: ThreeEvent<PointerEvent>, stroke: string) => {
    const { ctx, currentPosition } = checksBeforeDrawing(e, stroke) ?? {}
    if (!ctx || !currentPosition || !socket) return
    const from =
      stroke === 'line'
        ? {
            x: lastPosition.current.x ?? currentPosition.x,
            y: lastPosition.current.y ?? currentPosition.y,
          }
        : currentPosition
    ctx.beginPath()
    ctx.lineWidth = brushSize
    ctx.lineCap = `round`
    ctx.strokeStyle = color
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(currentPosition.x, currentPosition.y)
    ctx.stroke()

    if (stroke === 'line') {
      lastPosition.current = currentPosition
    }

    socket.emit(`makeBrushStroke`, {
      userId,
      brushStroke: {
        to: currentPosition,
        from: from,
        color: color,
        brushSize: brushSize,
      },
    })
  }
  return (
    <>
      <mesh
        scale={[BOARD_DIMENSIONS.width, BOARD_DIMENSIONS.height, 1]}
        onPointerMove={(e) => drawLine(e, `line`)}
        onPointerLeave={onLeave}
        onPointerDown={(e) => drawLine(e, 'dot')}
        receiveShadow
        castShadow
        ref={ref}
      >
        <boxGeometry />
        {imageLoaded && (
          <meshStandardMaterial metalness={0} roughness={0.6}>
            <canvasTexture attach="map" ref={textureRef} image={domNode} />
          </meshStandardMaterial>
        )}
      </mesh>
    </>
  )
}
