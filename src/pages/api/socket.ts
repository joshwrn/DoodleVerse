import {
  MakeBrushStroke,
  makeBrushStroke,
} from '@/server/events/server/makeBrushStroke'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket, ServerOptions } from 'socket.io'
import { Server } from 'socket.io'
import { createCanvas } from 'canvas'
import { CANVAS_RESOLUTION } from '@/state/constants'
import moment from 'moment'

import { MongoClient } from 'mongodb'

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

export type SocketClientToServer = {
  makeBrushStroke: (data: MakeBrushStroke) => void
}
export type SocketServerToClient = {
  loadCanvas: (data: string) => void
  makeBrushStroke: (data: MakeBrushStroke) => void
}

export type MySocket = Socket<SocketClientToServer, SocketServerToClient>
export type MyServer = Server<SocketClientToServer, SocketServerToClient>

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
    console.log(`Connected`)
    const totalUsers = io.engine.clientsCount
    console.log(`Total users: ${totalUsers}`)

    makeBrushStroke(socket, io, ctx)

    const LoadCanvas = async () => {
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
    LoadCanvas()

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

  io.on(`connection`, onConnection)

  console.log(`Set up`)
  res.end()
}
