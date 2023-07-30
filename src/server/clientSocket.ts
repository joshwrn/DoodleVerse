import { SocketClientToServer, SocketServerToClient } from '@/pages/api/socket'
import { usePlayerStore } from '@/state/settings/player'
import { useLayoutEffect } from 'react'
import { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { create } from 'zustand'
import { makeBrushStroke } from './events/client/makeBrushStroke'
import { loadCanvas } from './events/client/loadCanvas'
import { totalUsers } from './events/client/totalUsers'
import { loadPlayers } from './events/client/loadPlayers'
import { playerEvent } from './events/client/playerEvent'
import { playerJoined } from './events/client/playerJoined'
import { playerLeft } from './events/client/playerLeft'

export type ClientSocket = Socket<SocketServerToClient, SocketClientToServer>

let socket: ClientSocket

export const useSocketState = create<{
  socket: ClientSocket | null
  setSocket: (socket: ClientSocket) => void
  totalUsers: number
  setTotalUsers: (totalUsers: number) => void
}>((set) => ({
  totalUsers: 0,
  setTotalUsers: (totalUsers) => set({ totalUsers }),
  socket: null,
  setSocket: (socket) => set({ socket }),
}))

export const useSockets = ({
  canvasNode,
}: {
  canvasNode: HTMLCanvasElement | null
}): void => {
  const { setSocket, setTotalUsers } = useSocketState((state) => ({
    setSocket: state.setSocket,
    setTotalUsers: state.setTotalUsers,
  }))
  const { userId } = usePlayerStore((state) => ({
    userId: state.userId,
  }))
  useLayoutEffect(() => {
    if (!canvasNode) return
    socketInitializer(canvasNode)
  }, [canvasNode])

  const socketInitializer = async (canvasNode: HTMLCanvasElement) => {
    await fetch(`/api/socket`)
    socket = io()
    setSocket(socket)
    totalUsers(socket, setTotalUsers)
    makeBrushStroke(socket, userId, canvasNode)
    loadCanvas(socket, canvasNode)
    loadPlayers(socket)
    playerEvent(socket)
    playerJoined(socket)
    playerLeft(socket)
  }
}
