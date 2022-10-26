import create from 'zustand'

const useStore = create((set) => ({
  microphoneNavigation: false,
  changeMicrophoneNavigation: (microphoneNavigation) => set(() => ({microphoneNavigation: microphoneNavigation})),
  playerName: null,
  changePlayerName: (playerName) => set(() => ({playerName: playerName}))
}))

export default useStore