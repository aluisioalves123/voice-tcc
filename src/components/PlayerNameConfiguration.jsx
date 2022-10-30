import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import * as Speech from 'expo-speech'
import { useState, useEffect } from 'react'
import Voice from '@react-native-voice/voice'

import useStore from '../store'

const PlayerNameConfiguration = ({ navigation }) => {

  const startListening = async() => {
    await Voice.start('pt-BR')
  }

  const onSpeechResults = (result) => {
    console.log(result)
    
  }

  const onSpeechError = () => {
    console.log('erro')
    Speech.speak('não entendi, poderia repetir?')

    startListening()
  }

  useEffect(()=>{
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    // startListening()

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Nome do usuário</Text>
      <TextInput className='p-3 rounded border w-80 mb-2'></TextInput>
      <Button title='Confirmar'></Button>
    </SafeAreaView>
  );
}

export default PlayerNameConfiguration