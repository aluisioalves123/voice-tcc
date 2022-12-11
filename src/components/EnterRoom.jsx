import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import useStore from '../store'

const EnterRoom = ({ navigation }) => {
  const [temproomCode, setTemproomCode] = useState(null)
  const [roomCode, changeroomCode] = useStore((state) => [state.roomCode, state.changeroomCode])
  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)

  useFocusEffect(
    useCallback(()=>{
      changeVoiceInterfaceState('enter_room')
    }, [])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Nome da sala</Text>
      <TextInput className='p-3 rounded border w-80 mb-2' value={temproomCode}></TextInput>
      <Button title='Confirmar'></Button>
    </SafeAreaView>
  );
}

export default EnterRoom