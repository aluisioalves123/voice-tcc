import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import { useState } from 'react'
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import * as Speech from 'expo-speech'
import Voice from '@react-native-voice/voice';

import useStore from '../store'

const PlayerNameConfiguration = ({ navigation }) => {

  const startSpeechToText = async () => {
    await Voice.start("pt-BR");
  }

  const onSpeechResults = (result) => {
    Speech.speak(`por acaso seu nome é  ${result.value[0]}?`)
  }

  const onSpeechError = (error) => {
    console.log(error);
    startSpeechToText()
    Speech.speak('dormi no besouro, fala de novo aí')
  }

  useFocusEffect(
    useCallback(() => {
      Speech.speak('agora diga seu nome aí seu zé ruela')
      Voice.onSpeechError = onSpeechError
      Voice.onSpeechResults = onSpeechResults
      startSpeechToText()

      return () => {
        Voice.destroy().then(Voice.removeAllListeners)
      }
    }, [])
  )

  const microphoneNavigation = useStore((state) => state.microphoneNavigation)
  const changePlayerName = useStore((state) => state.changePlayerName)
  const [text, setText] = useState(null)

  const setPlayerName = () => {
    changePlayerName(text)
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Configuração de acessibilidade</Text>
      <TextInput className='p-3 mb-2 border border-gray-200 rounded-lg' 
        placeholder="Jogador, qual é o seu nome?" 
        onChangeText={(text) => setText(text)} />
      <Button title='Confirmar' onPress={() => setPlayerName()} />
    </SafeAreaView>
  );
}

export default PlayerNameConfiguration