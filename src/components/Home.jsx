import { SafeAreaView, Text, Button, View } from 'react-native';
import { NavigationHelpersContext, useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech'
import { useCallback } from 'react'

import Voice from '@react-native-voice/voice'

const Home = ({ navigation }) => {

  const startListening = async() => {
    Speech.speak(' ', {onDone: async() => {
      await Voice.start('pt-BR')
    }})
  }

  const onSpeechResults = (result) => {
    if (result.value.includes('entrar')) {
      navigation.navigate('EnterRoom')
    } else if (result.value.includes('criar')) {
      navigation.navigate('Room')
    } else {
      Speech.speak('Não entendi, repita')
      startListening()
    }
  }

  useFocusEffect(
    useCallback(()=>{
      Voice.onSpeechError = startListening;
      Voice.onSpeechResults = onSpeechResults;

      Speech.speak('Diga entrar para entrar, diga criar para criar')
      startListening()

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      }
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