import create from 'zustand'

const useStore = create((set) => ({
  voiceAccessibility: true,
  changeVoiceAccessibility: (voiceAccessibility) => set(() => ({voiceAccessibility: voiceAccessibility})),
  playerName: null,
  changePlayerName: (playerName) => set(() => ({playerName: playerName})),
  roomCode: null,
  changeRoomCode: (roomCode) => set(() => ({roomCode: roomCode})),
  voiceInterfaceState: null,
  changeVoiceInterfaceState: (voiceInterfaceState) => set(() => ({voiceInterfaceState: voiceInterfaceState})),
  cookie: '',
  changeCookie: (cookie) => set(() => ({cookie: cookie})),
  roomId: null,
  changeRoomId: (roomId) => set(() => ({roomId: roomId})),
  webSocket: null,
  changeWebSocket: (webSocket) => set(() => ({webSocket: webSocket})),
  currentQuestion: null,
  changeCurrentQuestion: (currentQuestion) => set(() => ({currentQuestion: currentQuestion})),
  roomUserCount: null,
  changeRoomUserCount: (roomUserCount) => set(() => ({roomUserCount: roomUserCount})),
  scoreboard: null,
  changeScoreboard:  (scoreboard) => set(() => ({scoreboard: scoreboard})),
  connectionMessage: null,
  roomAdmin: false,
  changeRoomAdmin: (roomAdmin) => set(() => ({roomAdmin: roomAdmin}))
}))
export default useStore