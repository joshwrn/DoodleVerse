import { motion } from 'framer-motion'
import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'

const ControlsContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-direction: column;
  width: fit-content;
  background-color: rgba(255, 255, 255, 1);
  padding: 10px;
  border-radius: 10px;
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
  border-radius: 4px;
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
const Box = styled.div`
  width: 100%;
  height: 30px;
  border-radius: 4px;
  color: black;
  font-size: 12px;
`

const Keys = ['A', 'S', 'D']

export const ControlsHud: FC = () => {
  return (
    <ControlsContainer
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: `100%`, opacity: 0 }}
      initial={{ y: `100%`, opacity: 0 }}
    >
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
      <Box>Movement</Box>
    </ControlsContainer>
  )
}
