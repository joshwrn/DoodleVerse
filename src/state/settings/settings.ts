import { create } from 'zustand'
import { useHotkeys } from 'react-hotkeys-hook'

export const useSettingsStore = create<{
  settingsOpen: boolean
  setSettingsOpen: (settingsOpen: boolean) => void
}>((set) => ({
  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
}))

export const useSettingsControls = () => {
  const { setSettingsOpen, settingsOpen } = useSettingsStore((s) => ({
    setSettingsOpen: s.setSettingsOpen,
    settingsOpen: s.settingsOpen,
  }))
  useHotkeys(
    [`escape`],
    (e) => {
      e.preventDefault()
      setSettingsOpen(!settingsOpen)
    },
    {
      keydown: true,
    }
  )
}
