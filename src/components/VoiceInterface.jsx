import * as Speech from 'expo-speech'
import Voice from '@react-native-voice/voice'

import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import useStore from '../store'

import { createUser } from '../api/users'
import { connectRoom, createRoom, getRoom } from '../api/rooms'
import { initGame, registerAnswer } from '../api/game'
import { useEffect } from 'react';

const VoiceInterface = () => {
  const stateRef = useRef()

  const [voiceAccessibility, changeVoiceAccessibility] = useStore((state) => [state.voiceAccessibility, state.changeVoiceAccessibility])
  const changePlayerName = useStore((state) => state.changePlayerName)
  const navigation = useNavigation();

  const changeRoomCode = useStore((state) => state.changeRoomCode)

  const currentQuestion = useStore((state) => state.currentQuestion)
  stateRef.currentQuestion = currentQuestion

  const scoreboard = useStore((state) => state.scoreboard)
  stateRef.scoreboard = scoreboard

  const [userAnswer, setUserAnswer] = useState({})
  stateRef.userAnswer = userAnswer

  const position_to_letter = {
    'first_alternative': 'A',
    'second_alternative': 'B',
    'third_alternative': 'C',
    'fourth_alternative': 'D'
  }

  const read_current_question = () => {
    let currentQuestion = stateRef.currentQuestion
    if (currentQuestion != null) {
      let message = `A pergunta é ${currentQuestion.question}. `
      message += "As alternativas são: "

      currentQuestion.alternatives.forEach((alternative) => {
        message += `letra ${position_to_letter[alternative.position]}, ${alternative.body}. `
      })

      message += 'Você entendeu?'

      return message
    } else {
      return 'no question'
    }
  }

  const read_score_board = () => {
    let scoreboard = stateRef.scoreboard

    let message = ''

    if (scoreboard != null) {
      Object.keys(scoreboard).forEach(key => {
        message += `${key} acertou ${scoreboard[key]} perguntas. `
      })
    }
  
    return message
  }

  useEffect(() => {
    if (currentQuestion != null) {
      changeVoiceInterfaceState('read_question')
    }
  }, [currentQuestion])

  useEffect(() => {
    if (scoreboard != null) {
      changeVoiceInterfaceState('end_game')
    }
  }, [scoreboard])
  
  const possible_states = {
    'configuration_voice_accessibility': {
      'message': 'acessibilidade?',
      'possible_next_states': {
        'sim': () => {
          changeVoiceAccessibility(true)
          changeVoiceInterfaceState('player_name_configuration')
          navigation.navigate('PlayerNameConfiguration')
        },
        'não': () => {
          changeVoiceAccessibility(false)
          changeVoiceInterfaceState('player_name_configuration')
          navigation.navigate('PlayerNameConfiguration') 
        },
      }
    },
    'player_name_configuration': {
      'message': 'qual o seu nome?',
      'possible_next_states': {
        'any': () => { 
          changePlayerName(stateRef.voiceResults[0])
          changeVoiceInterfaceState('confirm_player_name')
        }
      }
    },
    'confirm_player_name': {
      'message': `o seu nome é ${useStore.getState().playerName}?`,
      'possible_next_states': {
        'sim': () => {
          createUser(useStore.getState().playerName)
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
      'message': 'Criar ou entrar?',
      'possible_next_states': {
        'entrar': () => {
          navigation.navigate('EnterRoom')
          changeVoiceInterfaceState('enter_room')
        },
        'criar': () => {
          changeVoiceInterfaceState('create_room')
        }
      }
    },
    'create_room': {
      'message': 'Criar?',
      'possible_next_states': {
        'sim': async () => {
          await createRoom()

          Speech.speak(`Sala criada com sucesso, o nome da sala é ${useStore.getState().roomCode}`)

          await connectRoom()

          Speech.speak(`Sala conectada com sucesso`)

          navigation.navigate('Lobby')
          changeVoiceInterfaceState('admin_lobby')
        },
        'não': () => {
          navigation.navigate('Home')
          changeVoiceInterfaceState('home')
        }
      }
    },
    'enter_room': {
      'message': 'Nome da sala?',
      'possible_next_states': {
        'any': () => {
          changeRoomCode(stateRef.voiceResults[0])
          changeVoiceInterfaceState('confirm_room_code')
        }
      }
    },
    'confirm_room_code': {
      'message': `Sala ${useStore.getState().roomCode}?`,
      'possible_next_states': {
        'sim': async () => {
          Speech.speak('Procurando sala')
          
          await getRoom(useStore.getState().roomCode)

          await connectRoom()

          navigation.navigate('Lobby')
          changeVoiceInterfaceState('player_lobby')

        },
        'não': () => {
          changeVoiceInterfaceState('enter_room')
        }
      }
    },
    'room_not_found': {
      'message': 'Não encontrada, de novo?',
      'possible_next_states': {
        'sim': () => {
          changeVoiceInterfaceState('enter_room')
        },
        'não': () => {
          changeVoiceInterfaceState('home')
        }
      }
    },
    'player_lobby': {
      'message': 'Aguardando, diga sair para sair',
      'possible_next_states': {
        'sair': () => {
          navigation.navigate('Home')
          changeVoiceInterfaceState('home')
        }
      }
    },
    'admin_lobby': {
      'message': 'Na sala, iniciar ou sair',
      'possible_next_states': {
        'iniciar': () => {
          let roomId = useStore.getState().roomId
          initGame(roomId)
        },
        'sair': () => {
          navigation.navigate('Home')
          changeVoiceInterfaceState('home')
        }
      }
    },
    'game': {
      'message': 'Começou o jogo',
      'final_state': true
    },
    'read_question': {
      'message': `${ read_current_question() }`,
      'possible_next_states': {
        'sim': () => {
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
          let roomId = useStore.getState().roomId
          let letter_answer = stateRef.userAnswer.split(' ')[1]

          registerAnswer(letter_answer, roomId)
          changeVoiceInterfaceState('wait_for_next_question')
        },
        'não': () => {
          changeVoiceInterfaceState('wait_for_user_answer')
        }
      }
    },
    'wait_for_next_question': {
      'message': 'Agora aguarde os outros jogadores responderem',
      'final_state': true
    },
    'end_game': {
      'message': `O jogo acabou, o placar final foi: ${ read_score_board() } Deseja jogar novamente?`,
      'possible_next_states': {
        'sim': () => {
          let roomId = useStore.getState().roomId
          initGame(roomId)
        },
        'não': () => {
          changeVoiceInterfaceState('home')
        }
      }
    }
  }

  // ========================================

  const [changeVoiceInterfaceState, voiceInterfaceState] = useStore((state) => [state.changeVoiceInterfaceState, state.voiceInterfaceState])
  const [voiceResults, setVoiceResults] = useState([])
  stateRef.voiceResults = voiceResults

  const startListening = async() => {
    Speech.speak(' ', {onDone: async() => {
      await Voice.start('pt-BR')
    }})
  }

  const onSpeechError = () => {
    if (useStore.getState().voiceAccessibility) {
      let message = 'repita'
      console.log(`> ${message}`)
      Speech.speak(message, {onDone: async() => {
        startListening()
      }})
    }
  }

  useFocusEffect(
    useCallback(()=>{
      Voice.onSpeechError = onSpeechError
      Voice.onSpeechResults = onSpeechResults
      
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
      console.log(voiceInterfaceState)
      if (voiceInterfaceState != null && voiceAccessibility != false) {
        let voice_state = possible_states[voiceInterfaceState]

        Speech.speak(voice_state['message'])
        console.log(`> ${voice_state['message']}`)
        
        if (voice_state.final_state != true){ 
          startListening()
        }
      }
    }, [voiceInterfaceState])
  )
}

export default VoiceInterface
