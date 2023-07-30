import { useSocketState } from '@/server/clientSocket'
import { join } from '@/server/events/client/join'
import { usePlayerStore } from '@/state/settings/player'
import { useSettingsStore } from '@/state/settings/settings'
import type { FC } from 'react'

import styled from 'styled-components'

const Header = styled.div`
  h1 {
    font-size: 2.5rem;
    text-align: center;
    color: white;
  }
`
const FloatingHeader = styled(Header)`
  position: absolute;
  top: 15vh;
  left: 50%;
  transform: translateX(-50%);
`
const Button = styled.button<{ disabled?: boolean }>`
  background: #8400ff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  color: white;
  font-size: 18px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`
const FloatingButton = styled(Button)`
  position: absolute;
  bottom: 15vh;
  left: 50%;
  transform: translateX(-50%);
`

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90vw;
  max-width: 550px;
`
const StyledTerms = styled.div`
  position: relative;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  p {
    line-height: 1.5;
  }
  span {
    font-weight: bold;
  }
`

export const SelectOverlay: FC = () => {
  const { setAvatarSelected, avatarSelected, setAgreedToTerms } =
    useSettingsStore((s) => ({
      setAvatarSelected: s.setAvatarSelected,
      avatarSelected: s.avatarSelected,
      setAgreedToTerms: s.setAgreedToTerms,
    }))

  const { avatar } = usePlayerStore((s) => ({
    avatar: s.avatar,
  }))

  const socket = useSocketState((s) => s.socket)

  const agreeToTerms = () => {
    setAgreedToTerms(true)
    if (!socket) return
    join(socket)
  }

  return (
    <>
      {!avatarSelected && (
        <>
          <FloatingHeader>
            <h1>Choose Your Avatar</h1>
          </FloatingHeader>
          <FloatingButton
            disabled={avatar === null}
            onClick={() => setAvatarSelected(true)}
          >
            Continue
          </FloatingButton>
        </>
      )}
      {avatarSelected && (
        <Wrapper>
          <Header>
            <h1>Disclaimer</h1>
          </Header>
          <Terms />
          <Button onClick={() => agreeToTerms()}>I Understand</Button>
        </Wrapper>
      )}
    </>
  )
}

const Terms = () => {
  return (
    <StyledTerms>
      <p>
        <span>Welcome to my app!</span> Please read and understand the following
        disclaimer:
      </p>
      <p>
        <span>No Moderation:</span> This multiplayer drawing site operates
        without any content moderation. This means that all drawing on this
        platform is not reviewed or screened. As a result, the site does not
        endorse, verify, or guarantee the accuracy, appropriateness, or quality
        of any content drawn by users.
      </p>
      <p>
        <span>Overwriting of Inappropriate Content:</span> If you encounter any
        drawing that you find offensive, inappropriate, or harmful, you have the
        ability to draw over them, effectively replacing the original content
        with your own.
      </p>
      <p>
        <span>Drawings Are Not Permanent:</span> Any drawing you create will be
        drawn over by someone else and will not be saved. Take a screenshot if
        you want to keep your drawing.
      </p>
    </StyledTerms>
  )
}
