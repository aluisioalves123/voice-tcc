import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import * as Speech from 'expo-speech'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react'

import Voice from '@react-native-voice/voice'

import useStore from '../store'

const Lobby = ({ navigation }) => {
  const roomName = useStore((state) => state.roomName)

  const startListening = async() => {
    Speech.speak(' ', {onDone: async() => {
      await Voice.start('pt-BR')
    }})
  }

  const onSpeechResults = (result) => {
    if (result.value.includes('iniciar')) {
      navigation.navigate('Game')
    } else if (result.value.includes('sair')) {
      navigation.navigate('Home')
    } else {
      Speech.speak('Não entendi, pode repetir?')
      startListening()
    }
  }

  const onSpeechError = () => {
    Speech.speak('não entendi, repita', {onDone: async() => {
      startListening()
    }})
  }

  useFocusEffect(
    useCallback(()=>{
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;

      Speech.speak('Sala encontrada, diga iniciar para começar ou sair para sair da sala')
      startListening()

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      }
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