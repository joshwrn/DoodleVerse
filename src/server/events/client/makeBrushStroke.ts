import { ClientSocket } from '@/server/socket'

// socket: SocketClientToServer["brushStroke"],

export const makeBrushStroke = (
  socket: ClientSocket,
  userId: string,
  domNode: HTMLCanvasElement
) => {
  socket.on('makeBrushStroke', (data) => {
    if (data.userId !== userId) {
      const ctx = domNode?.getContext('2d')
      const { brushStroke } = data
      if (ctx) {
        ctx.beginPath()
        ctx.lineWidth = brushStroke.brushSize
        ctx.lineCap = `round`
        ctx.strokeStyle = brushStroke.color
        ctx.moveTo(brushStroke.from.x, brushStroke.from.y)
        ctx.lineTo(brushStroke.to.x, brushStroke.to.y)
        ctx.stroke()
      }
    }
  })
}
