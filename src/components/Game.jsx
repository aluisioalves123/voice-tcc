import { SafeAreaView, Text, Pressable, View , TextInput} from 'react-native';
import * as Speech from 'expo-speech'
import { useState, useCallback } from 'react'
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

  let current_question = quiz[0]
  const [countdown, setCountdown] = useState(null)

  useFocusEffect(
    useCallback(()=>{
      let counter = 59
      setInterval(() =>{
        counter--
        setCountdown(countdown)
      }, 1000);
    }, [])
  )

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-md'>{countdown}</Text>
      <Text className='text-lg'>{current_question.question}</Text>
      <View className='flex flex-row mt-3'>
        {current_question.alternatives.map((alternative, index) => (
          <Pressable className='wrap p-2 rounded border mr-2' key={index}>
            <Text>{alternative.option}) {alternative.answer}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default Game