import {
  MakeBrushStroke,
  makeBrushStroke,
} from '@/server/events/server/makeBrushStroke'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket, ServerOptions } from 'socket.io'
import { Server } from 'socket.io'
import { createCanvas } from 'canvas'
import { CANVAS_RESOLUTION } from '@/state/constants'

const canvas = createCanvas(CANVAS_RESOLUTION.width, CANVAS_RESOLUTION.height)
const ctx = canvas.getContext('2d')

export type SocketClientToServer = {
  makeBrushStroke: (data: MakeBrushStroke) => void
}
export type SocketServerToClient = {
  loadCanvas: (data: string) => void
  makeBrushStroke: (data: MakeBrushStroke) => void
}

export type MySocket = Socket<SocketClientToServer, SocketServerToClient>
export type MyServer = Server<SocketClientToServer, SocketServerToClient>

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse & {
    socket: {
      server: ServerOptions & {
        io: Server
      }
    }
  }
): void {
  console.log('Starting Socket.io 🚀')
  if (res?.socket?.server?.io) {
    console.log(`Already set up`)
    res.end()
    return
  }

  const io = new Server<SocketClientToServer, SocketServerToClient>(
    res?.socket?.server,
    {
      addTrailingSlash: false,
    }
  )
  res.socket.server.io = io

  const onConnection = (socket: MySocket) => {
    makeBrushStroke(socket, io, ctx)
    socket.emit(`loadCanvas`, canvas.toDataURL())
  }

  io.on(`connection`, onConnection)

  console.log(`Set up`)
  res.end()
}
