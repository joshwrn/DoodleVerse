import {
  MakeBrushStroke,
  makeBrushStroke,
} from '@/server/events/server/makeBrushStroke'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket, ServerOptions } from 'socket.io'
import { Server } from 'socket.io'
import { createCanvas } from 'canvas'
import { CANVAS_RESOLUTION } from '@/state/constants'

import { MongoClient } from 'mongodb'
import { LoadCanvas } from '@/server/events/server/loadCanvas'
import { disconnect } from '@/server/events/server/disconnect'
import { Player } from '@/state/settings/player'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

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
  players: (data: { for: string; players: ServerPlayer[] }) => void
}

export type MySocket = Socket<SocketClientToServer, SocketServerToClient>
export type MyServer = Server<SocketClientToServer, SocketServerToClient>

const users = new Map<string, ServerPlayer>()

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

  const client = await clientPromise
  const db = client.db('mural-db')

  const onConnection = async (socket: MySocket) => {
    console.log(`Total users: ${io.engine.clientsCount}`)

    makeBrushStroke(socket, io, ctx)
    LoadCanvas(socket, io, canvas, db)
    disconnect(socket, io, canvas, db, users)
    io.sockets.emit(`totalUsers`, io.engine.clientsCount)

    console.log('players', Array.from(users.values()))

    socket.on(`playerEvent`, (data) => {
      io.sockets.emit(`playerEvent`, data)
      if (!users.has(data.userId)) return
      const user = users.get(data.userId)
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
      users.set(data.userId, update)
    })

    socket.on('join', (data) => {
      socket.emit('players', {
        for: data.userId,
        players: Array.from(users.values()),
      })

      users.set(data.userId, {
        ...data,
        socketId: socket.id,
      })

      io.sockets.emit('playerJoined', {
        ...data,
        socketId: socket.id,
      })
    })
  }

  io.on(`connection`, onConnection)

  console.log(`Set up`)
  res.end()
}
