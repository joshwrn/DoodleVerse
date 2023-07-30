import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'
import { PiPaintBrushDuotone } from 'react-icons/pi'
import { AiOutlineUser } from 'react-icons/ai'
import { useSocketState } from '@/server/clientSocket'
import { usePlayerStore } from '@/state/settings/player'

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
const Container = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`
const SettingsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  color: black;
  padding: 10px;
`

export const Hud: FC = () => {
  const { otherPlayers } = usePlayerStore((s) => ({
    otherPlayers: s.otherPlayers,
  }))
  return (
    <Wrapper>
      <Container>
        <SettingsContainer>
          <AiOutlineUser />
          <p>{otherPlayers.length + 1}</p>
        </SettingsContainer>
        <SettingsContainer>
          <PiPaintBrushDuotone />
          <p>TAB</p>
        </SettingsContainer>
      </Container>
    </Wrapper>
  )
}
