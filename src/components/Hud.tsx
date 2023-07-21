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

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-direction: column;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
`
const Key = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  backdrop-filter: blur(10px);
  color: black;
  padding: 7px;
  padding-bottom: 10px;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    border: 1px solid black;
    position: relative;
    flex-shrink: 0;
    box-shadow:
      1px 0 1px 0 #eee,
      0 2px 0 2px #ccc,
      0 2px 0 3px #444;
  }
  p {
    font-size: 12px;
  }
`

const Keys = ['A', 'S', 'D']

export const Hud: FC = () => {
  return (
    <Wrapper>
      <SettingsContainer>
        <PiPaintBrushDuotone />
        <p>TAB</p>
      </SettingsContainer>
      <ControlsContainer>
        <div>
          <Key>
            <div>
              <p>W</p>
            </div>
          </Key>
        </div>
        <div>
          {Keys.map((key) => (
            <Key key={key}>
              <div>
                <p>{key}</p>
              </div>
            </Key>
          ))}
        </div>
      </ControlsContainer>
    </Wrapper>
  )
}
