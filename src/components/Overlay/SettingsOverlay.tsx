import type { FC } from 'react'
import React, { useCallback } from 'react'

import styled from 'styled-components'
import { useDrawStore } from '@/state/settings/draw'
import {
  useSettingsControls,
  useSettingsStore,
} from '@/state/settings/settings'
import { AnimatePresence, motion } from 'framer-motion'
import { ControlsHud } from './ControlsHud'
import { useEmitPlayerEvent } from '@/server/events/client/playerEvent'

const Backdrop = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
`

const Container = styled(motion.div)`
  width: 50vw;
  min-width: 500px;
  max-width: 700px;
  background-color: rgba(255, 255, 255, 1);
  height: 250px;
  border-radius: 50px;
  padding: 50px;
  color: black;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Row = styled.div`
  display: flex;
  width: 100%;
  height: 20px;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  input {
    cursor: pointer;
  }
  white-space: nowrap;
`
const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  p {
    font-size: 16px;
    font-weight: 600;
  }
`

const ColorHistory = styled.div`
  display: flex;
  white-space: nowrap;
  align-items: center;
  gap: 50px;
  justify-content: space-between;
  height: 20px;
  > div {
    display: flex;
    gap: 10px;
    > div {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid black;
    }
  }
`
const Drawing = styled(motion.div)<{ show: boolean }>`
  position: absolute;
  pointer-events: none;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -50%);
  z-index: ${({ show }) => (show ? 1 : -100)};
  width: fit-content;
  border: 1px solid red;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid black;
  canvas {
    display: block;
    width: 400px;
  }
`

const Wrapper = styled(motion.div)`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  gap: 20px;
`

export const SettingsOverlay: FC<{
  setCanvasNode: (node: HTMLCanvasElement) => void
}> = ({ setCanvasNode }) => {
  useSettingsControls()
  const onRefChange = useCallback((node: HTMLCanvasElement) => {
    setCanvasNode(node)
  }, [])
  const {
    color,
    setColor,
    brushSize,
    setBrushSize,
    colorHistory,
    setColorHistory,
  } = useDrawStore((s) => {
    return {
      color: s.brushColor,
      setColor: s.setBrushColor,
      brushSize: s.brushSize,
      setBrushSize: s.setBrushSize,
      colorHistory: s.colorHistory,
      setColorHistory: s.setColorHistory,
    }
  })
  const {
    setSettingsOpen,
    settingsOpen,
    soundEnabled,
    setSoundEnabled,
    agreedToTerms,
  } = useSettingsStore((s) => ({
    setSettingsOpen: s.setSettingsOpen,
    settingsOpen: s.settingsOpen,
    soundEnabled: s.soundEnabled,
    setSoundEnabled: s.setSoundEnabled,
    agreedToTerms: s.agreedToTerms,
  }))

  const emitPlayerEvent = useEmitPlayerEvent()

  const updateColorHistory = (color: string) => {
    if (colorHistory.includes(color)) return
    const newColorHistory = [...colorHistory]
    newColorHistory.unshift(color)
    newColorHistory.pop()
    setColorHistory(newColorHistory)
  }

  const pickFromHistory = (color: string) => {
    setColor(color)
    emitPlayerEvent({
      brushColor: color,
    })
    const newColorHistory = [...colorHistory]
    const filtered = newColorHistory.filter((c) => c !== color)
    filtered.unshift(color)
    setColorHistory(filtered)
  }

  const handleColorBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    updateColorHistory(e.target.value)
    emitPlayerEvent({
      brushColor: color,
    })
  }

  return (
    <>
      <AnimatePresence>
        {settingsOpen && (
          <>
            <Backdrop
              onClick={() => {
                setSettingsOpen(false)
              }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            />
            <Wrapper
              animate={{ y: 0, opacity: 1, x: `-50%` }}
              exit={{ y: `calc(100% + 50px)`, opacity: 0, x: `-50%` }}
              initial={{ y: `calc(100% + 50px)`, opacity: 0, x: `-50%` }}
              onClick={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
              }}
            >
              <ControlsHud />
              <Container>
                <Row
                  style={{
                    paddingBottom: `40px`,
                  }}
                >
                  <h1>Adjust</h1>
                  <p
                    onClick={() => {
                      setSettingsOpen(false)
                    }}
                    style={{ cursor: `pointer` }}
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
                      onBlur={(e) => handleColorBlur(e)}
                    />
                  </Row>
                  <ColorHistory>
                    <p>Color History</p>
                    <div>
                      {colorHistory.map((color, i) => (
                        <div
                          key={color + i}
                          style={{
                            backgroundColor: color,
                          }}
                          onClick={() => pickFromHistory(color)}
                        />
                      ))}
                    </div>
                  </ColorHistory>
                  <Row>
                    <p>Brush Size</p>
                    <input
                      type="range"
                      id="size"
                      name="size"
                      min="3"
                      max="300"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    />
                  </Row>
                  <Row>
                    <p>Sound</p>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                    />
                  </Row>
                </RowWrapper>
              </Container>
            </Wrapper>
          </>
        )}
      </AnimatePresence>
      <Drawing
        show={settingsOpen}
        animate={{ opacity: settingsOpen && agreedToTerms ? 1 : 0 }}
      >
        <canvas ref={onRefChange} />
      </Drawing>
    </>
  )
}
