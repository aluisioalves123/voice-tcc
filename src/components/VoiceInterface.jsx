import * as Speech from 'expo-speech'
import Voice from '@react-native-voice/voice'

import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import useStore from '../store'

const VoiceInterface = ({initial_state}) => {
  const stateRef = useRef()

  const changeVoiceAccessibility = useStore((state) => state.changeVoiceAccessibility)
  const changePlayerName = useStore((state) => state.changePlayerName)
  const navigation = useNavigation();
  
  const [roomName, setRoomName] = useState(null)
  stateRef.roomName = roomName

  const [currentQuestion, setCurrentQuestion] = useState(null)
  stateRef.currentQuestion = currentQuestion

  const [userAnswer, setUserAnswer] = useState({})
  stateRef.userAnswer = userAnswer

  const fetchCurrentQuestion = () => {
    // fazer uma requisição na api pra identificar a primeira questao
    let current_question = {
      question: '1- Qual a cor do cavalo branco de napoleão.',
      answer: 'A',
      alternatives: [
        {
          option: 'A',
          answer: 'Branco.'
        },
        {
          option: 'B',
          answer: 'Preto.'
        },
        {
          option: 'C',
          answer: 'Verde.'
        },
        {
          option: 'D',
          answer: 'Vermelho.'
        }
      ]
    }
    return current_question 
  }

  const read_current_question = () => {
    let current_question = stateRef.currentQuestion
    if (current_question != null) {
      let message = "A pergunta é "
      message += current_question.question
      message += "As alternativas são: "

      current_question.alternatives.forEach((alternative) => {
        message += `Letra ${alternative.option}, ${alternative.answer}`
      })

      message += 'Você entendeu?'

      return message
    } else {
      return 'abrobra'
    }
  }
  
  const possible_states = {
    'configuration_voice_accessibility': {
      'message': 'diga sim ou não',
      'possible_next_states': {
        'sim': () => {
          changeVoiceAccessibility(true)
          navigation.navigate('PlayerNameConfiguration') 
        },
        'não': () => {
          changeVoiceAccessibility(false)
          navigation.navigate('PlayerNameConfiguration') 
        },
      }
    },
    'player_name_configuration': {
      'message': 'diga seu nome por favor',
      'possible_next_states': {
        'any': () => { 
          changePlayerName(stateRef.voiceResults[0])
          changeVoiceInterfaceState('confirm_player_name')
        }
      }
    },
    'confirm_player_name': {
      'message': `Seu nome é ${useStore.getState().playerName}? Diga sim ou não`,
      'possible_next_states': {
        'sim': () => {
          navigation.navigate('Home')
          changeVoiceInterfaceState('home')
        },
        'não': () => {
          changePlayerName(null)
          changeVoiceInterfaceState('player_name_configuration')
        }
      }
    },
    'home': {
      'message': 'Bem-vindo',
      'possible_next_states': {
        'entrar': () => {
          navigation.navigate('EnterRoom')
          changeVoiceInterfaceState('enter_room')
        },
        'criar': () => {
          navigation.navigate('EnterRoom')
          changeVoiceInterfaceState('create_room')
        }
      }
    },
    'enter_room': {
      'message': 'diga o nome da sala',
      'possible_next_states': {
        'any': () => {
          setRoomName(stateRef.voiceResults[0])
          changeVoiceInterfaceState('confirm_room_name')
        }
      }
    },
    'confirm_room_name': {
      'message': `o nome da sala é ${stateRef.roomName}? Diga sim ou não`,
      'possible_next_states': {
        'sim': () => {
          // procurar sala na api
          let room_exists = true
          if (room_exists) {
            navigation.navigate('Lobby')
            changeVoiceInterfaceState('lobby')
          } else {
            changeVoiceInterfaceState('room_not_found')
          }
        },
        'não': () => {
          changeVoiceInterfaceState('enter_room')
        }
      }
    },
    'room_not_found': {
      'message': 'Sala não encontrada, quer tentar novamente? Diga sim ou não',
      'possible_next_states': {
        'sim': () => {
          changeVoiceInterfaceState('enter_room')
        },
        'não': () => {
          changeVoiceInterfaceState('home')
        }
      }
    },
    'lobby': {
      'message': 'Sala encontrada, diga iniciar para começar ou sair para sair da sala',
      'possible_next_states': {
        'iniciar': () => {
          changeVoiceInterfaceState('game')
          navigation.navigate('Game')
        },
        'sair': () => {
          navigation.navigate('Home')
          changeVoiceInterfaceState('home')
        }
      }
    },
    'game': {
      'message': 'Começou o jogo, você entendeu as regras?',
      'possible_next_states': {
        'sim': () => {
          let current_question = fetchCurrentQuestion()
          setCurrentQuestion(current_question)
          changeVoiceInterfaceState('read_question')
        },
        'não': () => {
          changeVoiceInterfaceState(null)
          changeVoiceInterfaceState('game')
        }
      }
    },
    'read_question': {
      'message': `${ read_current_question() }`,
      'possible_next_states': {
        'sim': () => {
          // iniciar contador para esse usuário
          changeVoiceInterfaceState('wait_for_user_answer')
        },
        'não': () => {
          changeVoiceInterfaceState(null)
          changeVoiceInterfaceState('read_question')
        }
      }
    },
    'wait_for_user_answer': {
      'message': 'Qual é sua resposta?',
      'possible_next_states': {
        'any': () => {
          let possible_valid_answers = ['letra a', 'letra b', 'letra c', 'letra d']
          let voice_result = stateRef.voiceResults[0]
          console.log(voice_result)
          if (possible_valid_answers.includes(voice_result)) {
            setUserAnswer(voice_result)
            changeVoiceInterfaceState('confirm_user_answer')
          } else {
            onSpeechError()
          }
        }
      }
    },
    'confirm_user_answer': {
      'message': `Sua resposta é a ${stateRef.userAnswer}? Diga sim ou não`,
      'possible_next_states': {
        'sim': () => {
          // enviar resposta para o servidor
          changeVoiceInterfaceState('wait_for_next_question')
        },
        'não': () => {
          changeVoiceInterfaceState('wait_for_user_answer')
        }
      }
    },
    'wait_for_next_question': {
      'message': 'Agora aguarde os outros jogadores responderem, você entendeu?',
      'possible_next_states': {
        'any': () => {
          // aguardar o servidor dizer pra avançar a proxima pergunta

          // trocar a current question

          changeVoiceInterfaceState('read_question')
        }
      }
    }
  }

  const changeVoiceInterfaceState = useStore((state) => state.changeVoiceInterfaceState)
  const voiceInterfaceState = useStore((state) => state.voiceInterfaceState)
  const [voiceResults, setVoiceResults] = useState([])
  stateRef.voiceResults = voiceResults

  const startListening = async() => {
    Speech.speak(' ', {onDone: async() => {
      await Voice.start('pt-BR')
    }})
  }

  const onSpeechError = () => {
    Speech.speak('Não entendi, repita', {onDone: async() => {
      startListening()
    }})
  }

  useFocusEffect(
    useCallback(()=>{
      Voice.onSpeechError = onSpeechError
      Voice.onSpeechResults = onSpeechResults

      if (initial_state != null) {
        changeVoiceInterfaceState(initial_state)
      }
      
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    }, [])
  )

  const onSpeechResults = (results) => {
    setVoiceResults(results['value'])
    console.log(results)

    let voiceInterfaceState = useStore.getState().voiceInterfaceState
    let voice_state = possible_states[voiceInterfaceState]
    let possible_answers = Object.keys(voice_state['possible_next_states'])

    let valid_answer_key = results['value'].map((result) => {
      if (possible_answers.includes(result)) {
        return result
      }
    })[0]

    let valid_answer = voice_state['possible_next_states'][valid_answer_key]
    let fallback_option = voice_state['possible_next_states']['any']
    
    let next_state = valid_answer || fallback_option
    if (next_state != undefined) {
      next_state()
    } else { 
      onSpeechError()
    }
  }

  useFocusEffect(
    useCallback(()=>{
      if (voiceInterfaceState != null) {
        let voice_state = possible_states[voiceInterfaceState]

        Speech.speak(voice_state['message'])
        startListening()
      }
    }, [voiceInterfaceState])
  )
}

export default VoiceInterface
