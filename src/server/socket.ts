import { SocketClientToServer, SocketServerToClient } from '@/pages/api/socket'
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

export const useSockets = (): void => {
  const { socket: socketState, setSocket } = useSocketState((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }))
  useLayoutEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    await fetch(`/api/socket`)
    socket = io()
    setSocket(socket)

    socket.on('brushStroke', (data) => {
      console.log('brushStroke', data)
    })
  }
}
