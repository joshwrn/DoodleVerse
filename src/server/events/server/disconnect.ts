import moment from 'moment'
import { MyServer, MySocket, ServerPlayer } from '@/pages/api/socket'
import { Canvas } from 'canvas'
import { Db } from 'mongodb'

const removeUser = (users: Map<string, ServerPlayer>, socket: MySocket) => {
  users.delete(socket.id)
  socket.broadcast.emit('playerLeft', socket.id)
}

export const disconnect = (
  socket: MySocket,
  io: MyServer,
  canvas: Canvas,
  db: Db,
  users: Map<string, ServerPlayer>
) => {
  socket.on(`disconnect`, async () => {
    console.log(`Disconnected`)
    removeUser(users, socket)
    if (io.engine.clientsCount === 0) {
      const inserted = await db.collection('mural-collection').insertOne({
        date: new Date(),
        data: canvas.toDataURL(),
      })
      await db.collection('mural-collection').deleteMany({
        _id: { $ne: inserted.insertedId },
        date: { $gt: new Date(moment().startOf('day').toDate()) },
      })
    }
  })
}
