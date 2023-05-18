import { SafeAreaView, Text, Button, View } from 'react-native';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech'

import useStore from '../store';

const AccessibilityConfiguration = ({ navigation }) => {

  const changeVoiceAccessibility = useStore((state) => state.changeVoiceAccessibility)
  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)

  useFocusEffect(
    useCallback(()=>{
      changeVoiceInterfaceState('configuration_voice_accessibility')
    }, [])
  )


  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg text-center'>Seja bem-vindo ao jogo de perguntas e respostas acessiveis</Text>
      <Text className='text-lg text-center'>Deseja jogar com o modo de acessibilidade de voz?</Text>
      <Text className="text-sm text-center">O jogo foi adaptado para também ser jogado inteiramente com comandos de voz</Text>
      <View className='flex flex-row mt-4 items-center'>
        <Button title='Não' onPress={() => {changeVoiceAccessibility(false), navigation.navigate('PlayerNameConfiguration'), Speech.stop()}}/>
        <Button title='Sim' onPress={() => {changeVoiceAccessibility(true), navigation.navigate('MicrophoneButton'), changeVoiceInterfaceState('player_name_configuration'), Speech.stop()}} />
      </View>
    </SafeAreaView>
  );
}

export default AccessibilityConfiguration