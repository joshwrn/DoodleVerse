import { MyServer, MySocket } from '@/pages/api/socket'

export type Point2d = {
  x: number
  y: number
}

export type BrushStroke = {
  from: Point2d
  to: Point2d
  color: string
  brushSize: number
}

export type MakeBrushStroke = {
  brushStroke: BrushStroke
  userId: string
}

export const makeBrushStroke = (socket: MySocket, io: MyServer): void => {
  console.log('makeBrushStroke')
  socket.on(`brushStroke`, (data) => {
    io.sockets.emit(`brushStroke`, data)
  })
}
