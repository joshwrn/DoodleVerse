import { ClientSocket } from '@/server/clientSocket'
import { usePlayerStore } from '@/state/settings/player'

export const playerLeft = (socket: ClientSocket) => {
  socket.on('playerLeft', (socketId) => {
    const otherPlayers = usePlayerStore.getState().otherPlayers
    const update = otherPlayers.filter((p) => p.socketId !== socketId)
    usePlayerStore.getState().setOtherPlayers(update)
  })
}
