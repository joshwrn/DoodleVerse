import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'
import { PiPaintBrushDuotone } from 'react-icons/pi'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: flex;
`
const SettingsContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  color: black;
  padding: 10px;
`

export const Hud: FC = () => {
  return (
    <Wrapper>
      <SettingsContainer>
        <PiPaintBrushDuotone />
        <p>ESC</p>
      </SettingsContainer>
    </Wrapper>
  )
}
