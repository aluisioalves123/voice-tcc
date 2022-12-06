import { SafeAreaView, Text, Button, View } from 'react-native';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

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
      <Text className='text-lg'>Configuração de acessibilidade</Text>
      <View className='flex flex-row'>
        <Button title='Não' onPress={() => {changeVoiceAccessibility(false), navigation.navigate('PlayerNameConfiguration')}}/>
        <Button title='Sim' onPress={() => {changeVoiceAccessibility(true), navigation.navigate('PlayerNameConfiguration')}} />
      </View>
    </SafeAreaView>
  );
}

export default AccessibilityConfiguration