import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react'

import useStore from '../store'

const Lobby = ({ navigation }) => {

  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)
  const roomUserCount = useStore((state) => state.roomUserCount)

  const roomCode = useStore((state) => state.roomCode)

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Sala {roomCode}</Text>
      <Text className='text-xl'>{roomUserCount}/4 jogadores</Text>
      <Button title='Iniciar partida'/>
      <Button title='Sair da sala'/>
    </SafeAreaView>
  );
}

export default Lobby