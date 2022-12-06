import { SafeAreaView, Text, Button, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react'

import useStore from '../store'

const Home = ({ navigation }) => {

  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)

  useFocusEffect(
    useCallback(()=>{
      changeVoiceInterfaceState('home')
    }, [])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Jogo do Milhão</Text>
      <Button title='Entrar em uma sala'/>
      <Button title='Criar uma sala'/>
      <Button title='Tutorial'/>
    </SafeAreaView>
  );
}

export default Home