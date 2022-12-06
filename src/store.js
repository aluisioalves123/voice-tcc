import create from 'zustand'

const useStore = create((set) => ({
  voiceAccessibility: true,
  changeVoiceAccessibility: (voiceAccessibility) => set(() => ({voiceAccessibility: voiceAccessibility})),
  playerName: null,
  changePlayerName: (playerName) => set(() => ({playerName: playerName})),
  roomName: null,
  changeRoomName: (roomName) => set(() => ({roomName: roomName})),
  voiceInterfaceState: null,
  changeVoiceInterfaceState: (voiceInterfaceState) => set(() => ({voiceInterfaceState: voiceInterfaceState})),
}))

export default useStore