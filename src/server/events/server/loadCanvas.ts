import { MyServer, MySocket } from '@/pages/api/socket'
import { Canvas, loadImage } from 'canvas'
import { Db } from 'mongodb'

export const LoadCanvas = async (
  socket: MySocket,
  io: MyServer,
  canvas: Canvas,
  db: Db
) => {
  let data = canvas.toDataURL()
  const ctx = canvas.getContext('2d')
  if (io.engine.clientsCount === 1) {
    const latest = await db
      .collection('mural-collection')
      .find({})
      .sort({ date: -1 })
      .limit(1)
      .toArray()
    if (latest[0]) {
      data = latest[0].data
      loadImage(data).then((image) => {
        ctx.drawImage(image, 0, 0)
      })
    }
  }
  socket.emit(`loadCanvas`, data)
}
