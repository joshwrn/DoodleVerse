import { SocketClientToServer, SocketServerToClient } from '@/pages/api/socket'
import { usePlayerStore } from '@/state/settings/player'
import { useEffect, useLayoutEffect } from 'react'
import { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { create } from 'zustand'

type ClientSocket = Socket<SocketServerToClient, SocketClientToServer>
let socket: ClientSocket

export const useSocketState = create<{
  socket: ClientSocket | null
  setSocket: (socket: ClientSocket) => void
}>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}))

export const useSockets = ({
  domNode,
}: {
  domNode: HTMLCanvasElement | null
}): void => {
  const { socket: socketState, setSocket } = useSocketState((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }))
  const { userId } = usePlayerStore((state) => ({
    userId: state.userId,
  }))
  useLayoutEffect(() => {
    if (!domNode) return
    socketInitializer()
  }, [domNode])

  const socketInitializer = async () => {
    await fetch(`/api/socket`)
    socket = io()
    setSocket(socket)

    socket.on('brushStroke', (data) => {
      console.log('brushStroke', {
        data,
        userId,
      })
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
}
