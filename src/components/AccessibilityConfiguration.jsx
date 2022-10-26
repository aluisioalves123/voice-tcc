import { SafeAreaView, Text, Button, View } from 'react-native';
import { useEffect } from 'react'
import * as Speech from 'expo-speech'
import Voice from '@react-native-voice/voice';

import useStore from '../store'

const AccessibilityConfiguration = ({ navigation }) => {

  const startSpeechToText = async () => {
    await Voice.start("pt-BR");
  }

  const onSpeechResults = (result) => {
    console.log(result.value)
    if (result.value.includes('sim')) {
      settingAccessibility(true)
    } else if (result.value.includes('não')) {
      settingAccessibility(false)
    } else {
      startSpeechToText()
      Speech.speak('não entendi, fale de novo')
    }
  }

  const onSpeechError = (error) => {
    console.log(error);
    startSpeechToText()
    Speech.speak('fala mais alto que eu sou míope')
  }
  
  const changeMicrophoneNavigation = useStore((state) => state.changeMicrophoneNavigation)

  const speakGreeting = () => {
    const greeting =  'Bem-vindo, diga sim pra ativar a acessibilidade por voz e não se não quiser'
    options = {}
    Speech.speak(greeting, options)
  }


  useEffect(() => {
    speakGreeting()
    Voice.onSpeechError = onSpeechError
    Voice.onSpeechResults = onSpeechResults
    startSpeechToText()

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  const settingAccessibility = (activated) => {
    changeMicrophoneNavigation(activated)
    navigation.navigate('PlayerNameConfiguration')
  }

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Configuração de acessibilidade</Text>
      <View className="flex flex-row">
        <Button title='Não' onPress={() => settingAccessibility(false)}/>
        <Button title='Sim'onPress={() => settingAccessibility(true)} />
      </View>
    </SafeAreaView>
  );
}

export default AccessibilityConfiguration