import { MyServer, MySocket } from '@/pages/api/socket'
import { Canvas } from 'canvas'
import { Db } from 'mongodb'

export const LoadCanvas = async (
  socket: MySocket,
  io: MyServer,
  canvas: Canvas,
  db: Db
) => {
  let data = canvas.toDataURL()
  if (io.engine.clientsCount === 1) {
    const latest = await db
      .collection('mural-collection')
      .find({})
      .sort({ date: -1 })
      .limit(1)
      .toArray()
    if (latest[0]) data = latest[0].data
  }
  socket.emit(`loadCanvas`, data)
}
