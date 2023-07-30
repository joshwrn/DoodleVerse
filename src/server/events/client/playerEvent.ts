import { PlayerEvent } from '@/pages/api/socket'
import { ClientSocket } from '@/server/clientSocket'
import { usePlayerStore } from '@/state/settings/player'

export const emitPlayerEvent = (
  socket: ClientSocket | null,
  data: PlayerEvent
) => {
  if (!socket) return
  socket.emit('playerEvent', data)
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
