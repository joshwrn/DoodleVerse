import moment from 'moment'
import { MyServer, MySocket } from '@/pages/api/socket'
import { Canvas } from 'canvas'
import { Db } from 'mongodb'

export const disconnect = (
  socket: MySocket,
  io: MyServer,
  canvas: Canvas,
  db: Db
) => {
  socket.on(`disconnect`, async () => {
    console.log(`Disconnected`)
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
