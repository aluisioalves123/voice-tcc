import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import * as Speech from 'expo-speech'
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import Voice from '@react-native-voice/voice'

import useStore from '../store'

const PlayerNameConfiguration = ({ navigation }) => {
  const [voiceResult, setVoiceResult] = useState([])
  const [voiceInterfaceState, setVoiceInterfaceState] = useState('waiting_for_name')
  const [tempPlayerName, setTempPlayerName] = useState(null)

  const changePlayerName = useStore((state) => state.changePlayerName)

  const startListening = async() => {
    Speech.speak(' ', {onDone: async() => {
      await Voice.start('pt-BR')
    }})
  }

  const onSpeechResults = (result) => {
    setVoiceResult(result.value)
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

      Speech.speak('Diga seu nome por favor')
      startListening()

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    }, [])
  )

  useFocusEffect(
    useCallback(()=>{
      if (voiceResult.length) {
        if (voiceInterfaceState == 'waiting_for_name') {
          setTempPlayerName(voiceResult[0])
          Speech.speak(`Seu nome é ${voiceResult[0]}? Diga sim ou não.`)
          setVoiceInterfaceState('waiting_for_confirmation')
          startListening()
        } else if (voiceInterfaceState == 'waiting_for_confirmation') {
          if (voiceResult.includes('sim')) {
            changePlayerName(tempPlayerName)
            navigation.navigate('Home')
          } else if (voiceResult.includes('não')) {
            Speech.speak('Diga seu nome novamente')
            setVoiceInterfaceState('waiting_for_name')
            startListening()
          }
        }
      }
    }, [voiceResult])
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