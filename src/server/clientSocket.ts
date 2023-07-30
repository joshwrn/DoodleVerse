import {
  ServerPlayer,
  SocketClientToServer,
  SocketServerToClient,
} from '@/pages/api/socket'
import { usePlayerStore } from '@/state/settings/player'
import { useLayoutEffect } from 'react'
import { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { create } from 'zustand'
import { makeBrushStroke } from './events/client/makeBrushStroke'
import { loadCanvas } from './events/client/loadCanvas'
import { totalUsers } from './events/client/totalUsers'

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
  domNode,
}: {
  domNode: HTMLCanvasElement | null
}): void => {
  const { setSocket, setTotalUsers } = useSocketState((state) => ({
    setSocket: state.setSocket,
    setTotalUsers: state.setTotalUsers,
  }))
  const { userId, setOtherPlayers } = usePlayerStore((state) => ({
    userId: state.userId,
    setOtherPlayers: state.setOtherPlayers,
  }))
  useLayoutEffect(() => {
    if (!domNode) return
    socketInitializer(domNode)
  }, [domNode])

  const socketInitializer = async (canvasNode: HTMLCanvasElement) => {
    await fetch(`/api/socket`)
    socket = io()
    setSocket(socket)
    totalUsers(socket, setTotalUsers)
    makeBrushStroke(socket, userId, canvasNode)
    loadCanvas(socket, canvasNode)

    socket.on('playerEvent', (data) => {
      if (data.userId === usePlayerStore.getState().userId) return
      console.log('playerEvent', data)
      const otherPlayers = usePlayerStore.getState().otherPlayers
      const player = otherPlayers.find((p) => p.userId === data.userId)
      if (!player) return otherPlayers
      const update = [
        ...otherPlayers.filter((p) => p.userId !== data.userId),
        {
          ...player,
          ...data,
        },
      ]
      usePlayerStore.getState().setOtherPlayers(update)
    })

    socket.on('playerJoined', (data) => {
      console.log('playerJoined', data.userId, usePlayerStore.getState().userId)
      if (data.userId === usePlayerStore.getState().userId) return
      console.log('playerJoined', data)
      const otherPlayers = usePlayerStore.getState().otherPlayers
      const update = [...otherPlayers, data]
      console.log('updating players')
      usePlayerStore.getState().setOtherPlayers(update)
    })

    socket.on('players', (data) => {
      console.log('players', data)
      if (data.for === usePlayerStore.getState().userId) {
        usePlayerStore.getState().setOtherPlayers(data.players)
      }
    })
  }
}
