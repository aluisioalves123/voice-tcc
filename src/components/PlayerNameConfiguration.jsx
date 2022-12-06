import { SafeAreaView, Text, Button, TextInput} from 'react-native';
import { useState, useCallback } from 'react'

import { useFocusEffect } from '@react-navigation/native';

import useStore from '../store'
const PlayerNameConfiguration = ({ navigation }) => {
  const [tempPlayerName, setTempPlayerName] = useState(null)
  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)

  useFocusEffect(
    useCallback(()=>{
      changeVoiceInterfaceState('player_name_configuration')
    }, [])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Nome do usuário</Text>
      <TextInput className='p-3 rounded border w-80 mb-2' value={tempPlayerName}></TextInput>
      <Button title='Confirmar'></Button>
    </SafeAreaView>
  );
}

export default PlayerNameConfiguration