import { MySocket, ServerPlayer } from '@/pages/api/socket'

export const playerEvent = (
  socket: MySocket,
  users: Map<string, ServerPlayer>
) => {
  socket.on(`playerEvent`, (data) => {
    socket.broadcast.emit(`playerEvent`, data)
    if (!users.has(socket.id)) return
    const user = users.get(socket.id)
    if (!user) return
    const update: ServerPlayer = {
      ...user,
      rotationY: data.rotationY ?? user.rotationY,
      position: {
        ...user.position,
        ...data.position,
      },
      brushColor: data.brushColor ?? user.brushColor,
    }
    users.set(socket.id, update)
  })
}
