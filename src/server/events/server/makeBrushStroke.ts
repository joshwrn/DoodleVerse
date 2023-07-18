import { MyServer, MySocket } from '@/pages/api/socket'
import { CanvasRenderingContext2D } from 'canvas'

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

export const makeBrushStroke = (
  socket: MySocket,
  io: MyServer,
  ctx: CanvasRenderingContext2D
): void => {
  socket.on(`makeBrushStroke`, (data) => {
    io.sockets.emit(`makeBrushStroke`, data)
    const { brushStroke } = data
    ctx.beginPath()
    ctx.lineWidth = brushStroke.brushSize
    ctx.lineCap = `round`
    ctx.strokeStyle = brushStroke.color
    ctx.moveTo(brushStroke.from.x, brushStroke.from.y)
    ctx.lineTo(brushStroke.to.x, brushStroke.to.y)
    ctx.stroke()
  })
}
