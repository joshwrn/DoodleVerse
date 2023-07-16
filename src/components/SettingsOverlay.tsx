import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'
import { useDrawStore } from '@/state/movement/draw'
import {
  useSettingsControls,
  useSettingsStore,
} from '@/state/settings/settings'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
`

const Container = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 50vw;
  min-width: 500px;
  max-width: 700px;
  background-color: white;
  height: fit-content;
  border-radius: 50px;
  padding: 50px;
  color: black;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.25);
  h1 {
    padding-bottom: 20px;
  }
`
const Row = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  p {
    font-size: 16px;
    font-weight: 600;
  }
  input {
    cursor: pointer;
  }
`
const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const SettingsOverlay: FC = () => {
  useSettingsControls()
  const { color, setColor, brushSize, setBrushSize } = useDrawStore((s) => {
    return {
      color: s.color,
      setColor: s.setColor,
      brushSize: s.brushSize,
      setBrushSize: s.setBrushSize,
    }
  })
  const { setSettingsOpen, settingsOpen } = useSettingsStore((s) => ({
    setSettingsOpen: s.setSettingsOpen,
    settingsOpen: s.settingsOpen,
  }))

  if (!settingsOpen) return null

  return (
    <>
      <Wrapper>
        <Container>
          <Row>
            <h1>Adjust</h1>
            <p
              onClick={() => {
                setSettingsOpen(false)
              }}
            >
              Close
            </p>
          </Row>
          <RowWrapper>
            <Row>
              <p>Brush Color</p>
              <input
                type="color"
                id="color"
                name="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Row>
            <Row>
              <p>Brush Size</p>
              <input
                type="range"
                id="size"
                name="size"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
              />
            </Row>
          </RowWrapper>
        </Container>
      </Wrapper>
    </>
  )
}
