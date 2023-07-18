import { SocketClientToServer, SocketServerToClient } from '@/pages/api/socket'
import { usePlayerStore } from '@/state/settings/player'
import { useEffect, useLayoutEffect } from 'react'
import { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { create } from 'zustand'
import { makeBrushStroke } from './events/client/makeBrushStroke'
import { loadCanvas } from './events/client/loadCanvas'

export type ClientSocket = Socket<SocketServerToClient, SocketClientToServer>
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
    socketInitializer(domNode)
  }, [domNode])

  const socketInitializer = async (canvasNode: HTMLCanvasElement) => {
    await fetch(`/api/socket`)
    socket = io()
    setSocket(socket)

    makeBrushStroke(socket, userId, canvasNode)
    loadCanvas(socket, canvasNode)
  }
}
