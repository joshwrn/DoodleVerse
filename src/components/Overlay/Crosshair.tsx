import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'
import { useDrawStore } from '@/state/settings/draw'
import {
  CANVAS_TO_BOARD_RATIO,
  MAX_DISTANCE_FROM_BOARD,
} from '@/state/constants'

export const Crosshair: FC = () => {
  const { distance, color, brushSize } = useDrawStore((s) => ({
    distance: s.distance,
    color: s.brushColor,
    brushSize: s.brushSize,
  }))
  const dis = distance ?? MAX_DISTANCE_FROM_BOARD
  const playerIsTooFar = dis >= MAX_DISTANCE_FROM_BOARD
  const size = (brushSize * CANVAS_TO_BOARD_RATIO) / dis
  return (
    <CrosshairContainer>
      <div
        style={{
          borderColor: `white`,
          borderWidth: playerIsTooFar ? `3px` : `1px`,
          width: playerIsTooFar ? 0 : size + `px`,
          height: playerIsTooFar ? 0 : size + `px`,
          boxShadow: `0 0 0 ${playerIsTooFar ? 0 : 1}px rgba(0, 0, 0, 0.5)`,
        }}
      >
        <div
          style={{
            backgroundColor: playerIsTooFar ? `white` : color,
            width: `100%`,
            height: `100%`,
            opacity: 0.5,
          }}
        />
      </div>
    </CrosshairContainer>
  )
}

const CrosshairContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  div {
    border-radius: 50%;
  }
  > div {
    width: 0px;
    height: 0px;
    border: 1px solid;
  }
`
