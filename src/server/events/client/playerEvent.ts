import { PlayerEvent } from '@/pages/api/socket'
import { ClientSocket } from '@/server/clientSocket'
import { usePlayerStore } from '@/state/settings/player'

export const emitPlayerEvent = (
  socket: ClientSocket | null,
  data: Omit<PlayerEvent, 'userId'>
) => {
  if (!socket) return
  const userId = usePlayerStore.getState().userId
  socket.emit('playerEvent', {
    ...data,
    userId,
  })
}
