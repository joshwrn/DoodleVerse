import { ClientSocket } from '@/server/clientSocket'
import { usePlayerStore } from '@/state/settings/player'

export const playerJoined = (socket: ClientSocket) => {
  socket.on('playerJoined', (data) => {
    if (data.userId === usePlayerStore.getState().userId) return
    const otherPlayers = usePlayerStore.getState().otherPlayers
    const update = [...otherPlayers, data]
    usePlayerStore.getState().setOtherPlayers(update)
  })
}
