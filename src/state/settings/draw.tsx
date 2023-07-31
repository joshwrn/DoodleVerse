import { useEffect } from 'react'
import { create } from 'zustand'

const randomColor = () =>
  '#000000'.replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16)
  })

const randomColors = (num: number) => {
  return Array.from({ length: num }, () => randomColor())
}

export const useDrawStore = create<{
  distance: number | null
  setDistance: (distance: number | null) => void

  mouseDown: boolean
  setMouseDown: (mouseDown: boolean) => void

  brushColor: string
  setBrushColor: (color: string) => void

  colorHistory: string[]
  setColorHistory: (colorHistory: string[]) => void

  brushSize: number
  setBrushSize: (brushSize: number) => void
}>((set) => ({
  distance: 0,
  setDistance: (distance) => set({ distance }),

  mouseDown: false,
  setMouseDown: (mouseDown) => set({ mouseDown }),

  brushColor: randomColor(),
  setBrushColor: (brushColor) => set({ brushColor }),

  colorHistory: randomColors(5),
  setColorHistory: (colorHistory) => set({ colorHistory }),

  brushSize: 30,
  setBrushSize: (brushSize) => set({ brushSize }),
}))

export const useMouseDown = () => {
  const { setMouseDown } = useDrawStore((s) => ({
    setMouseDown: s.setMouseDown,
  }))
  useEffect(() => {
    const onMouseDown = () => setMouseDown(true)
    const onMouseUp = () => setMouseDown(false)
    window.addEventListener(`mousedown`, onMouseDown)
    window.addEventListener(`mouseup`, onMouseUp)
    return () => {
      window.removeEventListener(`mousedown`, onMouseDown)
      window.removeEventListener(`mouseup`, onMouseUp)
    }
  }, [])
}
