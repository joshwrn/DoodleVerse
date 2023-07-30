import { MySocket, ServerPlayer } from '@/pages/api/socket'

export const join = (socket: MySocket, users: Map<string, ServerPlayer>) => {
  socket.on('join', (data) => {
    socket.emit('loadPlayers', {
      for: data.userId,
      players: Array.from(users.values()),
    })

    users.set(socket.id, {
      ...data,
      socketId: socket.id,
    })

    socket.broadcast.emit('playerJoined', {
      ...data,
      socketId: socket.id,
    })
  })
}
