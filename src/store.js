import create from 'zustand'

const useStore = create((set) => ({
  voiceAccessibility: false,
  changeVoiceAccessibility: (voiceAccessibility) => set(() => ({voiceAccessibility: voiceAccessibility})),
  playerName: null,
  changePlayerName: (playerName) => set(() => ({playerName: playerName})),
}))

export default useStore