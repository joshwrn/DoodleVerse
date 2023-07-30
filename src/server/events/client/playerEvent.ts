import { PlayerEvent } from '@/pages/api/socket'
import { ClientSocket, useSocketState } from '@/server/clientSocket'
import { usePlayerStore } from '@/state/settings/player'

export const useEmitPlayerEvent = () => {
  const socket = useSocketState((state) => state.socket)
  const userId = usePlayerStore((state) => state.userId)
  return (data: Omit<PlayerEvent, 'userId'>) => {
    if (!socket) return
    socket.emit('playerEvent', {
      ...data,
      userId,
    })
  }
}

export const playerEvent = (socket: ClientSocket) => {
  socket.on('playerEvent', (data) => {
    if (data.userId === usePlayerStore.getState().userId) return
    const otherPlayers = usePlayerStore.getState().otherPlayers
    const player = otherPlayers.find((p) => p.userId === data.userId)
    if (!player) return otherPlayers
    const update = [
      ...otherPlayers.filter((p) => p.userId !== data.userId),
      {
        ...player,
        ...data,
      },
    ]
    usePlayerStore.getState().setOtherPlayers(update)
  })
}
