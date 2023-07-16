import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'
import { useDrawStore } from '@/state/movement/draw'

export const Crosshair: FC = () => {
  const { distance, color } = useDrawStore((s) => ({
    distance: s.distance,
    color: s.color,
  }))
  const dis = distance ?? 30
  return (
    <CrosshairContainer>
      <div
        style={{
          borderColor: `white`,
          borderWidth: dis >= 30 ? `3px` : `1px`,
          width: 30 - dis + `px`,
          height: 30 - dis + `px`,
          boxShadow: `0 0 0 ${dis >= 30 ? 0 : 1}px rgba(0, 0, 0, 0.5)`,
        }}
      >
        <div
          style={{
            backgroundColor: dis <= 30 ? color : `white`,
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
