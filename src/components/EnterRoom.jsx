import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import useStore from '../store'

const EnterRoom = ({ navigation }) => {
  const [tempRoomName, setTempRoomName] = useState(null)
  const [roomName, changeRoomName] = useStore((state) => [state.roomName, state.changeRoomName])
  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)

  useFocusEffect(
    useCallback(()=>{
      changeVoiceInterfaceState('enter_room')
    }, [])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Nome da sala</Text>
      <TextInput className='p-3 rounded border w-80 mb-2' value={tempRoomName}></TextInput>
      <Button title='Confirmar'></Button>
    </SafeAreaView>
  );
}

export default EnterRoom