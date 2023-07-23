import { ClientSocket } from '@/server/clientSocket'

export const totalUsers = (
  socket: ClientSocket,
  setTotalUsers: (totalUsers: number) => void
) => {
  socket.on('totalUsers', (data) => {
    console.log(`Total users: ${data}`)
    setTotalUsers(data)
  })
}
