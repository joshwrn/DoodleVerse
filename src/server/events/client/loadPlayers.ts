import { ClientSocket } from '@/server/clientSocket'
import { usePlayerStore } from '@/state/settings/player'

export const loadPlayers = (socket: ClientSocket) => {
  socket.on('loadPlayers', (data) => {
    if (data.for === usePlayerStore.getState().userId) {
      usePlayerStore.getState().setOtherPlayers(data.players)
    }
  })
}
