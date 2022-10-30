import create from 'zustand'

const useStore = create((set) => ({
  voiceAccessibility: false,
  changeVoiceAccessibility: (voiceAccessibility) => set(() => ({voiceAccessibility: voiceAccessibility})),
  playerName: null,
  changePlayerName: (playerName) => set(() => ({playerName: playerName})),
  roomName: null,
  changeRoomName: (roomName) => set(() => ({roomName: roomName})),
}))

export default useStore