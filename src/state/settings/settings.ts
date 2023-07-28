import { create } from 'zustand'
import { useHotkeys } from 'react-hotkeys-hook'

export const useSettingsStore = create<{
  settingsOpen: boolean
  setSettingsOpen: (settingsOpen: boolean) => void

  avatarSelected: boolean
  setAvatarSelected: (avatarSelected: boolean) => void

  agreedToTerms: boolean
  setAgreedToTerms: (agreedToTerms: boolean) => void
}>((set) => ({
  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),

  avatarSelected: false,
  setAvatarSelected: (avatarSelected) => set({ avatarSelected }),

  agreedToTerms: false,
  setAgreedToTerms: (agreedToTerms) => set({ agreedToTerms }),
}))

export const useSettingsControls = () => {
  const { setSettingsOpen, settingsOpen } = useSettingsStore((s) => ({
    setSettingsOpen: s.setSettingsOpen,
    settingsOpen: s.settingsOpen,
  }))
  useHotkeys(
    [`tab`],
    (e) => {
      e.preventDefault()
      setSettingsOpen(!settingsOpen)
    },
    {
      keydown: true,
    }
  )
}
