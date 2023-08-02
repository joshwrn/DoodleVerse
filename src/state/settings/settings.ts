import { create } from 'zustand'
import { useHotkeys } from 'react-hotkeys-hook'
import useSound from 'use-sound'

export const useSettingsStore = create<{
  settingsOpen: boolean
  setSettingsOpen: (settingsOpen: boolean) => void

  avatarSelected: boolean
  setAvatarSelected: (avatarSelected: boolean) => void

  agreedToTerms: boolean
  setAgreedToTerms: (agreedToTerms: boolean) => void

  soundEnabled: boolean
  setSoundEnabled: (soundEnabled: boolean) => void

  musicEnabled: boolean
  setMusicEnabled: (musicEnabled: boolean) => void
}>((set) => ({
  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),

  avatarSelected: false,
  setAvatarSelected: (avatarSelected) => set({ avatarSelected }),

  agreedToTerms: false,
  setAgreedToTerms: (agreedToTerms) => set({ agreedToTerms }),

  soundEnabled: true,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

  musicEnabled: process.env.NODE_ENV === `production` ? true : false,
  setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
}))

export const useSettingsControls = () => {
  const { setSettingsOpen, settingsOpen } = useSettingsStore((s) => ({
    setSettingsOpen: s.setSettingsOpen,
    settingsOpen: s.settingsOpen,
    soundEnabled: s.soundEnabled,
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
