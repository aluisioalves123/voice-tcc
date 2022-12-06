import { SafeAreaView, Text, Pressable, View , TextInput} from 'react-native';
import { useState, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import useStore from '../store'

const Game = ({ navigation }) => {
  const quiz = [
    {
      question: '1- Qual a cor do cavalo branco de napoleão',
      answer: 'A',
      alternatives: [
        {
          option: 'A',
          answer: 'Branco'
        },
        {
          option: 'B',
          answer: 'Preto'
        },
        {
          option: 'C',
          answer: 'Verde'
        },
        {
          option: 'D',
          answer: 'Vermelho'
        }
      ]
    },
    {
      question: '2- Quantas sílabas tem a palavra amendoim?',
      answer: 'C',
      alternatives: [
        {
          option: 'A',
          answer: '2'
        },
        {
          option: 'B',
          answer: '3'
        },
        {
          option: 'C',
          answer: '5'
        },
        {
          option: 'D',
          answer: '4'
        }
      ]
    },
    {
      question: "3- Qual o nome do autor do livro 'O iluminado'?",
      answer: 'B',
      alternatives: [
        {
          option: 'A',
          answer: 'Albert Einstein'
        },
        {
          option: 'B',
          answer: 'Stephen King'
        },
        {
          option: 'C',
          answer: 'Aluísio de Azevedo'
        },
        {
          option: 'D',
          answer: 'Kurt Cobain'
        }
      ]
    }
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
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
    setAnsweredOption(selectedOption)

    stopTimer()
  }

  const nextQuestion = () => {
    if (quiz[currentQuestion + 1] != undefined) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setAnsweredOption(null)
      startTimer()
    }
  }

  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)

  useFocusEffect(
    useCallback(()=>{
      changeVoiceInterfaceState('game')
    }, [])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>{quiz[currentQuestion].question}</Text>
      <View className='flex flex-row flex-wrap mt-3 p-2 justify-center'>
        {quiz[currentQuestion].alternatives.map((alternative, index) => (
          <Pressable className='p-2 rounded border mr-2 mb-2 basis-2/5'
                     key={index} onPress={() => setSelectedOption(alternative.option)}
                     style={{backgroundColor: optionBgColor(alternative.option)}}>
            <Text>{alternative.option}) {alternative.answer}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable className={`p-2 rounded mt-3 bg-blue-800 ${(answeredOption == null) ? '' : 'hidden'}`} onPress={() => answerQuestion()}>
        <Text className='text-white'>Responder</Text>
      </Pressable>

      <Pressable className={`p-2 rounded mt-3 bg-blue-800 ${(answeredOption != null) ? '' : 'hidden'}`} onPress={() => nextQuestion()}>
        <Text className='text-white'>Próxima pergunta</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default Game