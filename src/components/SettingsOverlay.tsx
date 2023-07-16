import type { FC } from 'react'
import React from 'react'

import styled from 'styled-components'

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
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 50vw;
  min-width: 300px;
  background-color: white;
  height: 500px;
  border-radius: 50px;
  padding: 50px;
  color: black;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.25);
`

export const SettingsOverlay: FC = () => {
  return (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Container>
        <h1>Settings</h1>
      </Container>
    </Wrapper>
  )
}
