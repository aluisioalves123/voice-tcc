import { SafeAreaView, Text, Button, View } from 'react-native';
import * as Speech from 'expo-speech'
import { useEffect } from 'react';
import Voice from '@react-native-voice/voice'

import useStore from '../store';

const AccessibilityConfiguration = ({ navigation }) => {

  const changeVoiceAccessibility = useStore((state) => state.changeVoiceAccessibility)

  const startListening = async() => {
    await Voice.start('pt-BR')
  }

  const onSpeechResults = (result) => {
    console.log(result)
    if (result.value.includes('sim')) {
      navigation.navigate('PlayerNameConfiguration')
      changeVoiceAccessibility(true)
    } else if (result.value.includes('não')) {
      navigation.navigate('PlayerNameConfiguration')
      changeVoiceAccessibility(false)
    }
  }

  const onSpeechError = () => {
    console.log('erro')
    startListening()
  }

  useEffect(()=>{
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    startListening()

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Configuração de acessibilidade</Text>
      <View className='flex flex-row'>
        <Button title='Não' onPress={() => {changeVoiceAccessibility(false), navigation.navigate('PlayerNameConfiguration')}}/>
        <Button title='Sim' onPress={() => {changeVoiceAccessibility(true), navigation.navigate('PlayerNameConfiguration')}} />
      </View>
    </SafeAreaView>
  );
}

export default AccessibilityConfiguration