import { SafeAreaView, Text, Pressable, View , TextInput} from 'react-native';
import { useState, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import useStore from '../store'

import { registerAnswer } from '../api/game'

const Game = ({ navigation }) => {

  const currentQuestion = useStore(state => state.currentQuestion)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answeredOption, setAnsweredOption] = useState(null)

  const optionBgColor = (option) => {
    if (answeredOption != null && option == quiz[currentQuestion].answer) {
      return 'green'
    }

    if (selectedOption == option) {
      return 'yellow'
    }

    return 'white'
  }

  const answerQuestion = () => {
    registerAnswer(selectedOption, roomId)
  }

  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)

  useFocusEffect(
    useCallback(()=>{
      changeVoiceInterfaceState('game')
    }, [])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>{currentQuestion.question}</Text>
      <View className='flex flex-row flex-wrap mt-3 p-2 justify-center'>
        {currentQuestion.alternatives.map((alternative, index) => (
          <Pressable className='p-2 rounded border mr-2 mb-2 basis-2/5'
                     key={index} onPress={() => setSelectedOption(alternative.position)}
                     style={{backgroundColor: optionBgColor(alternative.position)}}>
            <Text>{alternative.position}) {alternative.answer}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default Game