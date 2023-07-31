import React, { useEffect } from 'react'
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber'
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
import { useSettingsStore } from '@/state/settings/settings'
import { Point2d } from '@/server/events/server/makeBrushStroke'
import * as THREE from 'three'
import { usePhysicsFrame } from '@/hooks/usePhysicsFrame'
import useSound from 'use-sound'

const convertVector3ToCanvasCoords = ({ point }: { point: Vector3 }) => {
  const x2d = point.x * CANVAS_TO_BOARD_RATIO
  const y2d = point.y * CANVAS_TO_BOARD_RATIO
  const currentPosition = {
    x: CANVAS_RESOLUTION.width - x2d,
    y: CANVAS_RESOLUTION.height - y2d,
  }
  return currentPosition
}

const raycaster = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(0, 0, 1),
  0,
  MAX_DISTANCE_FROM_BOARD
)

export const Board = ({
  canvasNode: domNode,
}: {
  canvasNode: HTMLCanvasElement | null
}) => {
  const [ref] = useBox<Mesh>(() => ({
    position: [BOARD_DIMENSIONS.width / 2, BOARD_DIMENSIONS.height / 2, 40],
    args: [BOARD_DIMENSIONS.width, BOARD_DIMENSIONS.height, 1],
    type: `Static`,
  }))

  const textureRef = React.useRef<THREE.CanvasTexture>(null)
  const { setDistance, mouseDown, color, brushSize } = useDrawStore((s) => ({
    setDistance: s.setDistance,
    mouseDown: s.mouseDown,
    color: s.brushColor,
    brushSize: s.brushSize,
  }))
  const { userId } = usePlayerStore((s) => ({
    userId: s.userId,
  }))
  const { imageLoaded } = useImageLoadedStore((s) => ({
    imageLoaded: s.imageLoaded,
  }))
  const { settingsOpen } = useSettingsStore((s) => ({
    settingsOpen: s.settingsOpen,
  }))
  const [isDrawing, setIsDrawing] = React.useState(false)

  const [play, sound] = useSound(`/sounds/marker.mp3`, {
    volume: 1,
    loop: true,
    interrupt: true,
  })

  useEffect(() => {
    if (isDrawing) {
      play()
    } else {
      sound.stop()
    }
  }, [isDrawing])

  const socket = useSocketState((state) => state.socket)

  const lastPosition = React.useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  })
  const currentPositionRef = React.useRef<{
    x: number | null
    y: number | null
  }>({
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
    setIsDrawing(false)
  }

  const { camera, mouse } = useThree()

  usePhysicsFrame(({ shouldUpdate }) => {
    if (!mouseDown && isDrawing) {
      setIsDrawing(false)
    }
    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
    if (ref) {
      raycaster.setFromCamera(mouse, camera)
      const ray = raycaster.intersectObject(ref.current!)[0]
      if (!ray) {
        onLeave()
        return
      }
      const { distance, point } = ray
      setDistance(distance)
      currentPositionRef.current = convertVector3ToCanvasCoords({ point })
    }
  })

  const checksBeforeDrawing = (e: ThreeEvent<PointerEvent>, stroke: string) => {
    if (settingsOpen) return null
    const ctx = domNode?.getContext(`2d`)
    if (!ctx) return null
    if (e.distance > MAX_DISTANCE_FROM_BOARD) {
      onLeave()
      return null
    }
    if (!mouseDown && stroke === 'line') {
      resetLastPosition()
      return null
    }
    return { ctx }
  }

  const drawLine = (e: ThreeEvent<PointerEvent>, stroke: string) => {
    const { ctx } = checksBeforeDrawing(e, stroke) ?? {}
    const currentPosition = currentPositionRef.current
    if (!ctx || !currentPosition.x || !currentPosition.y || !socket) return
    if (!isDrawing) {
      setIsDrawing(true)
    }
    const from =
      stroke === 'line'
        ? {
            x: lastPosition.current.x ?? currentPosition.x,
            y: lastPosition.current.y ?? currentPosition.y,
          }
        : currentPosition

    if (!from.x || !from.y) return
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
        to: currentPosition as Point2d,
        from: from as Point2d,
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
          <meshStandardMaterial metalness={0} roughness={0.1}>
            <canvasTexture attach="map" ref={textureRef} image={domNode} />
          </meshStandardMaterial>
        )}
      </mesh>
    </>
  )
}
