import React, { useEffect } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { useDrawStore } from '@/state/movement/draw'
import {
  BOARD_DIMENSIONS,
  CANVAS_RESOLUTION,
  CANVAS_TO_BOARD_RATIO,
  MAX_DISTANCE_FROM_BOARD,
} from '@/state/constants'
import { useBox } from '@react-three/cannon'
import { IMAGE } from '@/state/image'

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

  useEffect(() => {
    if (domNode) {
      const ctx = domNode.getContext(`2d`)
      if (ctx) {
        domNode.width = CANVAS_RESOLUTION.width
        domNode.height = CANVAS_RESOLUTION.height
        ctx.fillStyle = `white`
        ctx.fillRect(0, 0, CANVAS_RESOLUTION.width, CANVAS_RESOLUTION.height)
        var img = new Image()
        ctx.drawImage(img, 0, 0)
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
        }
        img.src = IMAGE
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

  const checksBeforeDrawing = (e: ThreeEvent<PointerEvent>) => {
    if (!domNode) return null
    const ctx = domNode.getContext(`2d`)
    if (!ctx) return null
    if (e.distance > MAX_DISTANCE_FROM_BOARD) {
      onLeave()
      return null
    }
    setDistance(e.distance)
    if (!mouseDown) {
      resetLastPosition()
      return null
    }
    const currentPosition = convertVector3ToCanvasCoords({
      point: e.point,
    })
    return { ctx, currentPosition }
  }

  const drawLine = (e: ThreeEvent<PointerEvent>) => {
    const { ctx, currentPosition } = checksBeforeDrawing(e) ?? {}
    if (!ctx || !currentPosition) return
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

  const drawDot = (e: ThreeEvent<PointerEvent>) => {
    const { ctx, currentPosition } = checksBeforeDrawing(e) ?? {}
    if (!ctx || !currentPosition || !domNode) return
    const dataurl = domNode.toDataURL()
    console.log(dataurl)
    ctx.beginPath()
    ctx.lineWidth = brushSize
    ctx.lineCap = `round`
    ctx.strokeStyle = color
    ctx.moveTo(currentPosition.x, currentPosition.y)
    ctx.lineTo(currentPosition.x, currentPosition.y)
    ctx.stroke()
  }
  return (
    <>
      <mesh
        scale={[BOARD_DIMENSIONS.width, BOARD_DIMENSIONS.height, 1]}
        onPointerMove={drawLine}
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
