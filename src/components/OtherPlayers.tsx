import { Player, usePlayerStore } from '@/state/settings/player'
import type { FC } from 'react'
import React from 'react'
import { styled } from 'styled-components'
import { WomanMesh } from './Avatar/WomanMesh'
import { ManMesh } from './Avatar/ManMesh'

const OtherPlayer = ({ player }: { player: Player }) => {
  return (
    <group
      rotation={[0, player.rotationY, 0]}
      position={[player.position.x, 0, player.position.z]}
    >
      {player.avatar === 1 ? (
        <ManMesh brushColor={player.brushColor} />
      ) : (
        <WomanMesh brushColor={player.brushColor} />
      )}
    </group>
  )
}

export const OtherPlayers: FC = () => {
  const otherPlayers = usePlayerStore((s) => s.otherPlayers)
  return (
    <>
      {otherPlayers.map((player) => (
        <OtherPlayer key={player.userId + 'other-player'} player={player} />
      ))}
    </>
  )
}

const DebugWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  z-index: 1000;
  > div {
    margin-bottom: 20px;
    border: 1px solid white;
    padding: 10px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
  }
`

export const DebugPlayers = () => {
  const { otherPlayers, id } = usePlayerStore((s) => ({
    otherPlayers: s.otherPlayers,
    id: s.userId,
  }))
  return (
    <DebugWrapper>
      <p>this id: {id}</p>
      {otherPlayers.map((player) => (
        <div key={player.userId}>
          <b>id:</b> {player.userId}{' '}
          <p>
            <b>position:</b> {player.position.x} - {player.position.z}
          </p>
          <p>
            <b>rotation:</b> {player.rotationY}
          </p>
          <p>
            <b>avatar:</b> {player.avatar}
          </p>
          <p>
            <b>brushColor:</b> {player.brushColor}
          </p>
        </div>
      ))}
    </DebugWrapper>
  )
}
