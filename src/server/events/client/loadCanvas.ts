import { ClientSocket } from '@/server/clientSocket'
import { CANVAS_RESOLUTION } from '@/state/constants'
import { create } from 'zustand'

export const useImageLoadedStore = create<{
  imageLoaded: boolean
  setImageLoaded: (imageLoaded: boolean) => void
}>((set) => ({
  imageLoaded: false,
  setImageLoaded: (imageLoaded) => set({ imageLoaded }),
}))

export const loadCanvas = (
  socket: ClientSocket,
  domNode: HTMLCanvasElement
) => {
  const { setImageLoaded } = useImageLoadedStore.getState()
  socket.on('loadCanvas', (data) => {
    const img = new Image()
    img.onload = () => {
      const ctx = domNode.getContext('2d')
      if (!ctx) {
        throw new Error(`Could not get context`)
      }
      console.log('loading image 🖼️')
      domNode.width = CANVAS_RESOLUTION.width
      domNode.height = CANVAS_RESOLUTION.height
      ctx.fillStyle = `white`
      ctx.fillRect(0, 0, CANVAS_RESOLUTION.width, CANVAS_RESOLUTION.height)
      ctx.drawImage(img, 0, 0)
      setImageLoaded(true)
      console.log('image loaded 🖼️')
    }
    img.src = data
  })
}
