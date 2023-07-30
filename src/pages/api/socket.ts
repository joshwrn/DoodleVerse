import {
  MakeBrushStroke,
  makeBrushStroke,
} from '@/server/events/server/makeBrushStroke'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket, ServerOptions } from 'socket.io'
import { Server } from 'socket.io'
import { createCanvas } from 'canvas'
import { CANVAS_RESOLUTION } from '@/state/constants'

import { LoadCanvas } from '@/server/events/server/loadCanvas'
import { disconnect } from '@/server/events/server/disconnect'
import { Player } from '@/state/settings/player'
import { join } from '@/server/events/server/join'
import { playerEvent } from '@/server/events/server/playerEvent'

import { initMongo } from '@/server/mongodb'

const clientPromise = initMongo()

// SOCKET.IO
const canvas = createCanvas(CANVAS_RESOLUTION.width, CANVAS_RESOLUTION.height)
const ctx = canvas.getContext('2d')

export type PlayerEvents = {
  position: { x: number; z: number }
  rotationY: number
  brushColor: string
}

export type PlayerEvent = { userId: string } & Partial<PlayerEvents>

export type ServerPlayer = Player & {
  socketId: string
}

export type SocketClientToServer = {
  makeBrushStroke: (data: MakeBrushStroke) => void
  playerEvent: (data: PlayerEvent) => void
  join: (data: Player) => void
}
export type SocketServerToClient = {
  loadCanvas: (data: string) => void
  makeBrushStroke: (data: MakeBrushStroke) => void
  playerEvent: (data: PlayerEvent) => void
  totalUsers: (data: number) => void
  playerJoined: (data: ServerPlayer) => void
  playerLeft: (data: string) => void
  loadPlayers: (data: { for: string; players: ServerPlayer[] }) => void
}

export type MySocket = Socket<SocketClientToServer, SocketServerToClient>
export type MyServer = Server<SocketClientToServer, SocketServerToClient>

const users = new Map<string, ServerPlayer>()

// socket.broadcast.emit = send to everyone except the sender
// io.sockets.emit = send to everyone including the sender

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse & {
    socket: {
      server: ServerOptions & {
        io: Server
      }
    }
  }
): Promise<void> {
  console.log('Starting Socket.io 🚀')
  if (res?.socket?.server?.io) {
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

  const client = await clientPromise
  const db = client.db('mural-db')

  const onConnection = async (socket: MySocket) => {
    makeBrushStroke(socket, io, ctx)
    LoadCanvas(socket, io, canvas, db)
    playerEvent(socket, users)
    disconnect(socket, io, canvas, db, users)
    join(socket, users)

    io.sockets.emit(`totalUsers`, io.engine.clientsCount)
  }

  io.on(`connection`, onConnection)

  res.end()
}
