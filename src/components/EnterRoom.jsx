import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import * as Speech from 'expo-speech'
import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import Voice from '@react-native-voice/voice'

import useStore from '../store'

const EnterRoom = ({ navigation }) => {
  const [voiceResult, setVoiceResult] = useState([])
  const [voiceInterfaceState, setVoiceInterfaceState] = useState('waiting_for_room_name')
  const [tempRoomName, setTempRoomName] = useState(null)
  const [roomName, changeRoomName] = useStore((state) => [state.roomName, state.changeRoomName])

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

      Speech.speak('Diga o nome da sala por favor')
      startListening()

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    }, [])
  )

  useFocusEffect(
    useCallback(()=>{
      if (voiceResult.length) {
        if (voiceInterfaceState == 'waiting_for_room_name') {
          setTempRoomName(voiceResult[0])
          Speech.speak(`O nome da sala é ${voiceResult[0]}? Diga sim ou não.`)
          setVoiceInterfaceState('waiting_for_confirmation')
          startListening()
        } else if (voiceInterfaceState == 'waiting_for_confirmation') {
          if (voiceResult.includes('sim')) {
            Speech.speak('Aguarde enquanto procuramos a sala', {onDone: ()=> {
              let room_exists = true
              if (room_exists) {
                changeRoomName(tempRoomName)
                navigation.navigate('Lobby')
              } else {
                Speech.speak('Sala não encontrada, tente outra sala')
                setTempRoomName(null)
                setVoiceInterfaceState('waiting_for_name')
                startListening()
              }
            }})
            // buscar a sala na api
            // redirecionar para a tela de sala se achar
            // se nao, dizer que nao achou e pedir pro usuario tentar de novo
          } else if (voiceResult.includes('não')) {
            Speech.speak('Diga o nome da sala novamente')
            setVoiceInterfaceState('waiting_for_name')
            startListening()
          }
        }
      }
    }, [voiceResult])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Nome da sala</Text>
      <TextInput className='p-3 rounded border w-80 mb-2' value={tempRoomName}></TextInput>
      <Button title='Confirmar'></Button>
    </SafeAreaView>
  );
}

export default EnterRoom