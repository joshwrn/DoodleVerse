import type { FC } from 'react'

import styled from 'styled-components'
import { PiPaintBrushDuotone } from 'react-icons/pi'
import { AiOutlineUser } from 'react-icons/ai'
import { usePlayerStore } from '@/state/settings/player'
import { HiOutlineSpeakerXMark, HiOutlineSpeakerWave } from 'react-icons/hi2'
import { useSettingsStore } from '@/state/settings/settings'

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
  height: 40px;
  min-width: 40px;
`

export const Hud: FC = () => {
  const { otherPlayers } = usePlayerStore((s) => ({
    otherPlayers: s.otherPlayers,
  }))
  const { soundEnabled, musicEnabled } = useSettingsStore((s) => ({
    soundEnabled: s.soundEnabled,
    musicEnabled: s.musicEnabled,
  }))
  return (
    <Wrapper>
      <Container>
        <SettingsContainer>
          <AiOutlineUser />
          <p>{otherPlayers.length + 1}</p>
        </SettingsContainer>
        <SettingsContainer>
          {soundEnabled || musicEnabled ? (
            <HiOutlineSpeakerWave />
          ) : (
            <HiOutlineSpeakerXMark />
          )}
        </SettingsContainer>
        <SettingsContainer>
          <PiPaintBrushDuotone />
          <p>TAB</p>
        </SettingsContainer>
      </Container>
    </Wrapper>
  )
}
