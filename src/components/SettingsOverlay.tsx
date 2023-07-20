import type { FC } from 'react'
import React, { useCallback } from 'react'

import styled from 'styled-components'
import { useDrawStore } from '@/state/settings/draw'
import {
  useSettingsControls,
  useSettingsStore,
} from '@/state/settings/settings'
import { AnimatePresence, motion } from 'framer-motion'

const Backdrop = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
`

const Container = styled(motion.div)`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 50vw;
  min-width: 500px;
  max-width: 700px;
  background-color: rgba(255, 255, 255, 1);
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
  > div {
    display: flex;
    gap: 10px;
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

export const SettingsOverlay: FC<{
  setDomNode: (node: HTMLCanvasElement) => void
}> = ({ setDomNode }) => {
  useSettingsControls()
  const onRefChange = useCallback((node: HTMLCanvasElement) => {
    setDomNode(node)
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
      color: s.color,
      setColor: s.setColor,
      brushSize: s.brushSize,
      setBrushSize: s.setBrushSize,
      colorHistory: s.colorHistory,
      setColorHistory: s.setColorHistory,
    }
  })
  const { setSettingsOpen, settingsOpen } = useSettingsStore((s) => ({
    setSettingsOpen: s.setSettingsOpen,
    settingsOpen: s.settingsOpen,
  }))

  const updateColorHistory = (color: string) => {
    if (colorHistory.includes(color)) return
    const newColorHistory = [...colorHistory]
    newColorHistory.unshift(color)
    newColorHistory.pop()
    setColorHistory(newColorHistory)
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

            <Container
              animate={{ y: 0, opacity: 1, x: `-50%` }}
              exit={{ y: `100%`, opacity: 0, x: `-50%` }}
              initial={{ y: `100%`, opacity: 0, x: `-50%` }}
            >
              <Row>
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
                    onBlur={(e) => updateColorHistory(e.target.value)}
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
                          width: `20px`,
                          height: `20px`,
                          borderRadius: `50%`,
                          cursor: `pointer`,
                        }}
                        onClick={() => {
                          setColor(color)
                        }}
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
              </RowWrapper>
            </Container>
          </>
        )}
      </AnimatePresence>
      <Drawing show={settingsOpen} animate={{ opacity: settingsOpen ? 1 : 0 }}>
        <canvas ref={onRefChange} />
      </Drawing>
    </>
  )
}
