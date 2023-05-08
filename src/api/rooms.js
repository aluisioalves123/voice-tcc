import Constants from 'expo-constants';
import useStore from '../store'
import * as RootNavigation from '../../RootNavigation';
import { getScoreboard } from './game'

const apiUrl = Constants.expoConfig.extra.apiUrl
const webSocketUrl = Constants.expoConfig.extra.webSocketUrl

const getRoom = async (roomCode) => {
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }
  
  await fetch(`${apiUrl}/find_room/${roomCode}`, requestOptions)
  .then(response => response.json())
  .then(data => {
    useStore.setState({roomId: data.id})
    useStore.setState({roomCode: data.code})
  })
}

const createRoom = async () => {
  const requestOptions = {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }

  await fetch(`${apiUrl}/rooms`, requestOptions)
  .then(response => response.json())
  .then(data => {
    useStore.setState({roomId: data.id})
    useStore.setState({roomCode: data.code})
  });
}

const connectRoom = async () => {
  let roomId = useStore.getState().roomId
  let webSocket = new WebSocket(webSocketUrl)
  useStore.setState({webSocket: webSocket})

  webSocket.onopen = (event) => {
    const subMessage = {
      command: "subscribe",
      identifier: JSON.stringify({ 
        channel: "RoomsChannel", 
        room_id: roomId
      })
    }

    webSocket.send(JSON.stringify(subMessage))
  }

  webSocket.onmessage = (event) => {
    let data = JSON.parse(event.data)


    if (data.message != undefined) {
      let message = JSON.parse(data.message)
      switch(message['message_type']) {
        case 'room_info':
          useStore.setState({roomUserCount: message['user_count']})
          break
        case 'init_game':
          useStore.setState({voiceInterfaceState: 'game'})
          //RootNavigation.navigate('Game')
          break
        case 'sending_question': 
          let currentQuestion = {
            question: message['question']['body'],
            alternatives: message['alternatives']
          }
    
          useStore.setState({currentQuestion: currentQuestion})
          break
        case 'sending_scoreboard':
          useStore.setState({scoreboard: message['scoreboard']})
          console.log(message['scoreboard'])
          break
        case 'end_game': 
          getScoreboard(roomId)
          break
      }
    }
  }
}

const disconnectRoom = async () => {
  console.log("abuble")
  let webSocket = useStore.getState().webSocket
  let roomId = useStore.getState().roomId

  const unsubMessage = {
    command: "unsubscribe",
    identifier: JSON.stringify({ 
      channel: "RoomsChannel", 
      room_id: roomId
    })
  }
  
  webSocket.send(JSON.stringify(unsubMessage))
}

export { getRoom, createRoom, connectRoom, disconnectRoom }