import { useEffect } from "react";
import { create } from "zustand";

export const useDrawStore = create<{
    distance: number | null
    setDistance: (distance: number | null) => void

    mouseDown: boolean
    setMouseDown: (mouseDown: boolean) => void

    color: string
    setColor: (color: string) => void
}>((set) => ({
    distance: 0,
    setDistance: (distance) => set({ distance }),

    mouseDown: false,
    setMouseDown: (mouseDown) => set({ mouseDown }),

    color: `#ee00ff`,
    setColor: (color) => set({ color }),
}))

export const useMouseDown = () => {
    const { mouseDown, setMouseDown } = useDrawStore((s) => ({
        mouseDown: s.mouseDown,
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