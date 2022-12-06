import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react'

import useStore from '../store'

const Lobby = ({ navigation }) => {

  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)

  const roomName = useStore((state) => state.roomName)

  useFocusEffect(
    useCallback(()=>{
      changeVoiceInterfaceState('lobby')
    }, [])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Sala {roomName}</Text>
      <Text className='text-xl'>1/4 jogadores</Text>
      <Button title='Iniciar partida'/>
      <Button title='Sair da sala'/>
    </SafeAreaView>
  );
}

export default Lobby