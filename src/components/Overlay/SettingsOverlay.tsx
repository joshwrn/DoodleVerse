import type { FC } from 'react'
import React, { useCallback, useEffect } from 'react'

import styled from 'styled-components'
import { useDrawStore } from '@/state/settings/draw'
import {
  useSettingsControls,
  useSettingsStore,
} from '@/state/settings/settings'
import { AnimatePresence, motion } from 'framer-motion'
import { ControlsHud } from './ControlsHud'
import { useEmitPlayerEvent } from '@/server/events/client/playerEvent'
import useSound from 'use-sound'

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: -1;
`

const Container = styled(motion.div)`
  width: 50vw;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 50px;
  padding: 50px;
  color: black;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
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
  h1 {
    color: black;
  }
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
    > div {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid black;
    }
  }
`
const Drawing = styled(motion.div)`
  width: fit-content;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.45);
  position: relative;
  flex-shrink: 0;
  canvas {
    display: block;
    width: 100%;
  }
`

const Wrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 100;
  gap: 20px;
  width: 100%;
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
    setMusicEnabled,
    musicEnabled,
  } = useSettingsStore((s) => ({
    setSettingsOpen: s.setSettingsOpen,
    settingsOpen: s.settingsOpen,
    soundEnabled: s.soundEnabled,
    setSoundEnabled: s.setSoundEnabled,
    agreedToTerms: s.agreedToTerms,
    setMusicEnabled: s.setMusicEnabled,
    musicEnabled: s.musicEnabled,
  }))

  const emitPlayerEvent = useEmitPlayerEvent()

  const updateColorHistory = (color: string) => {
    const newColorHistory = [...colorHistory]
    if (colorHistory.includes(color)) {
      const filtered = newColorHistory.filter((c) => c !== color)
      filtered.unshift(color)
      setColorHistory(filtered)
    } else {
      newColorHistory.unshift(color)
      newColorHistory.pop()
      setColorHistory(newColorHistory)
    }
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

  const [play] = useSound(`/sounds/hover.mp3`, {
    volume: 0.2,
    loop: false,
    interrupt: false,
    soundEnabled,
  })

  useEffect(() => {
    play()
  }, [settingsOpen])

  return (
    <>
      <Outer
        animate={{
          zIndex: settingsOpen ? 100 : -1,
        }}
        transition={{
          zIndex: {
            delay: settingsOpen ? 0 : 0.5,
          },
        }}
      >
        <Inner
          animate={{
            y: settingsOpen ? 0 : `calc(100% + 50px)`,
            opacity: settingsOpen ? 1 : 0,
          }}
          transition={{
            type: `spring`,
            damping: 20,
            stiffness: 200,
          }}
        >
          <AnimatePresence>
            {settingsOpen && (
              <>
                <Wrapper
                  onClick={(e) => {
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()
                  }}
                >
                  <ControlsHud />
                  <Container>
                    <Row
                      style={{
                        paddingBottom: `20px`,
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
                          onChange={(e) =>
                            setBrushSize(parseInt(e.target.value))
                          }
                        />
                      </Row>
                      <Row>
                        <p>Sound Effects</p>
                        <input
                          type="checkbox"
                          checked={soundEnabled}
                          onChange={(e) => setSoundEnabled(e.target.checked)}
                        />
                      </Row>
                      <Row>
                        <p>Music</p>
                        <input
                          type="checkbox"
                          checked={musicEnabled}
                          onChange={(e) => setMusicEnabled(e.target.checked)}
                        />
                      </Row>
                    </RowWrapper>
                  </Container>
                </Wrapper>
              </>
            )}
          </AnimatePresence>
          <Drawing animate={{ opacity: settingsOpen && agreedToTerms ? 1 : 0 }}>
            <canvas ref={onRefChange} />
          </Drawing>
        </Inner>
        <AnimatePresence>
          {settingsOpen && (
            <Backdrop
              onClick={() => {
                setSettingsOpen(false)
              }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </Outer>
    </>
  )
}

const Inner = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 100%;
  width: 100%;
`

const Outer = styled(motion.div)`
  position: absolute;
  height: 100vh;
  width: 100vw;
  padding: 15vw;
`
