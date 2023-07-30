import { ClientSocket } from '@/server/clientSocket'
import { useDrawStore } from '@/state/settings/draw'
import { usePlayerStore } from '@/state/settings/player'

export const join = (socket: ClientSocket) => {
  const { userId, avatar } = usePlayerStore.getState()
  const brushColor = useDrawStore.getState().brushColor
  if (!userId || !avatar) return
  socket.emit('join', {
    avatar,
    userId,
    rotationY: 0,
    position: { x: 100, z: -10 },
    brushColor,
  })
}
