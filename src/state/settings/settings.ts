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
}>((set) => ({
  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),

  avatarSelected: false,
  setAvatarSelected: (avatarSelected) => set({ avatarSelected }),

  agreedToTerms: false,
  setAgreedToTerms: (agreedToTerms) => set({ agreedToTerms }),

  soundEnabled: process.env.NODE_ENV === `production` ? true : false,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
}))

export const useSettingsControls = () => {
  const { setSettingsOpen, settingsOpen, soundEnabled } = useSettingsStore(
    (s) => ({
      setSettingsOpen: s.setSettingsOpen,
      settingsOpen: s.settingsOpen,
      soundEnabled: s.soundEnabled,
    })
  )
  const [play] = useSound(`/sounds/hover.mp3`, {
    volume: 0.2,
    loop: false,
    interrupt: false,
    soundEnabled,
  })
  useHotkeys(
    [`tab`],
    (e) => {
      e.preventDefault()
      setSettingsOpen(!settingsOpen)
      play()
    },
    {
      keydown: true,
    }
  )
}
