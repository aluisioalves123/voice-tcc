import { SafeAreaView, Text, Button } from 'react-native';
import { useEffect } from 'react'

import useStore from '../store'

import { disconnectRoom } from '../api/rooms'
import { initGame } from '../api/game'

const Lobby = ({ navigation }) => {
  
  const changeRoomAdmin = useStore(state => state.changeRoomAdmin)
  const roomAdmin = useStore(state => state.roomAdmin)
  const roomUserCount = useStore((state) => state.roomUserCount)
  const currentQuestion = useStore(state => state.currentQuestion)
  const roomCode = useStore((state) => state.roomCode)
  const roomId = useStore((state) => state.roomId)

  const handleGameStart = () => {
    initGame(roomId)
    navigation.navigate('Game')
  };

  const handleRoomDisconnect = async () => {
    navigation.navigate('Home')
    changeRoomAdmin(false)
    disconnectRoom()
  };

  useEffect(() => {
    if (currentQuestion != null) {
      navigation.navigate("Game")
    }
  }, [currentQuestion])

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Sala {roomCode}</Text>
      <Text className='text-xl'>{roomUserCount}/4 jogadores</Text>
      {roomAdmin ? (
         <Button title='Iniciar partida' onPress={handleGameStart}/>
      ) : null}
      <Button title='Sair da sala' onPress={handleRoomDisconnect}/>
    </SafeAreaView>
  );
}

export default Lobby