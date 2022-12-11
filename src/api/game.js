import Constants from 'expo-constants';
import useStore from '../store'

const initGame = (roomId) => {
  let webSocket = useStore.getState().webSocket

  const initMessage = {
    command: "message",
    identifier: JSON.stringify({
      channel: "RoomsChannel",
      room_id: roomId
    }),
    data: JSON.stringify({
      action: 'init_game'
    })
  }

  webSocket.send(JSON.stringify(initMessage))
}

const registerAnswer = (alternativePosition, roomId) => {
  let webSocket = useStore.getState().webSocket

  const registerAnswerMessage = {
    command: "message",
    identifier: JSON.stringify({
      channel: "RoomsChannel",
      room_id: roomId
    }),
    data: JSON.stringify({
      action: 'register_answer',
      alternative_position: alternativePosition
    })
  }

  webSocket.send(JSON.stringify(registerAnswerMessage))
}

const getScoreboard = (roomId) => {
  let webSocket = useStore.getState().webSocket

  const getScoreboardMessage = {
    command: "message",
    identifier: JSON.stringify({
      channel: "RoomsChannel",
      room_id: roomId
    }),
    data: JSON.stringify({
      action: 'show_current_scoreboard'
    })
  }

  webSocket.send(JSON.stringify(getScoreboardMessage))
}

export { initGame, registerAnswer, getScoreboard }