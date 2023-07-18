import { ClientSocket } from '@/server/socket'

export const loadCanvas = (
  socket: ClientSocket,
  domNode: HTMLCanvasElement
) => {
  socket.on('loadCanvas', (data) => {
    const img = new Image()
    img.onload = () => {
      const ctx = domNode.getContext('2d')
      ctx?.drawImage(img, 0, 0)
    }
    img.src = data
  })
}
