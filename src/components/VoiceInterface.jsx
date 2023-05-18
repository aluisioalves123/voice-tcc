import * as Speech from 'expo-speech'
import Voice from '@react-native-voice/voice'

import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import useStore from '../store'

import { createUser } from '../api/users'
import { connectRoom, createRoom, getRoom, disconnectRoom } from '../api/rooms'
import { initGame, registerAnswer } from '../api/game'

const VoiceInterface = forwardRef((props, ref) => {
  const stateRef = useRef()

  const [voiceAccessibility, changeVoiceAccessibility] = useStore((state) => [state.voiceAccessibility, state.changeVoiceAccessibility])
  const changePlayerName = useStore((state) => state.changePlayerName)
  const navigation = useNavigation();

  const changeRoomCode = useStore((state) => state.changeRoomCode)

  const currentQuestion = useStore((state) => state.currentQuestion)
  stateRef.currentQuestion = currentQuestion

  const roomUserCount = useStore((state) => state.roomUserCount)
  stateRef.roomUserCount = roomUserCount

  const scoreboard = useStore((state) => state.scoreboard)
  stateRef.scoreboard = scoreboard

  const [userAnswer, setUserAnswer] = useState(null)
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

      return message
    } else {
      return 'no question'
    }
  }

  const currentUserAnswer = () => {
    let user_answer = stateRef.userAnswer
    let currentQuestion = stateRef.currentQuestion

    if (currentQuestion != null && userAnswer != null) {
      let answer_letter = position_to_letter[user_answer]

      let answer_alternative = stateRef.currentQuestion.alternatives.find(alternative => alternative.position == user_answer)
      let answer_body = answer_alternative.body
  
      return `letra ${answer_letter}, ${answer_body}?`
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
    if (roomUserCount != null && voiceInterfaceState == 'player_lobby' || voiceInterfaceState == 'admin_lobby') {
      Speech.speak(`${roomUserCount} jogadores estão conectados a sala agora`)
    }
  }, [roomUserCount])

  useEffect(() => {
    if (scoreboard != null) {
      changeVoiceInterfaceState('end_game')
    }
  }, [scoreboard])
  
  const possible_states = {
    'configuration_voice_accessibility': {
      'message': 'Seja bem-vindo ao jogo de perguntas e respostas acessiveis, você gostaria de jogar com o modo de acessibilidade ligado? Aperte em qualquer parte da tela, espere o som de confirmação e responda sim ou não. Em qualquer momento você pode dizer repita e eu vou repetir o que acabei de dizer.',
      'possible_next_states': {
        'sim': () => {
          changeVoiceAccessibility(true)
          changeVoiceInterfaceState('player_name_configuration')
          navigation.navigate('MicrophoneButton')
        },
        'não': () => {
          changeVoiceAccessibility(false)
          changeVoiceInterfaceState('player_name_configuration')
          navigation.navigate('PlayerNameConfiguration') 
        },
      }
    },
    'player_name_configuration': {
      'message': 'Modo de acessibilidade ligado. Para começarmos, preciso saber o seu nome, qual é o seu nome?',
      'possible_next_states': {
        'any': () => { 
          changePlayerName(stateRef.voiceResults[0])
          changeVoiceInterfaceState('confirm_player_name')
        }
      }
    },
    'confirm_player_name': {
      'message': `Entendi, diga sim para confirmar que seu nome é ${useStore.getState().playerName}. Se não, diga não para repetir`,
      'possible_next_states': {
        'sim': () => {
          createUser(useStore.getState().playerName)
          changeVoiceInterfaceState('home')
          
        },
        'não': () => {
          changePlayerName(null)
          changeVoiceInterfaceState('player_name_configuration')
        }
      }
    },
    'home': {
      'message': 'Você agora está no menu principal do jogo, aqui você pode escolher entrar em uma sala já existente ou criar uma sala nova. Para criar uma nova sala diga criar, mas se quiser entrar em uma sala diga entrar.',
      'possible_next_states': {
        'entrar': () => {
          changeVoiceInterfaceState('enter_room')
        },
        'criar': () => {
          changeVoiceInterfaceState('create_room')
        }
      }
    },
    'create_room': {
      'message': 'Diga sim para confirmar a criação da sala, mas se não quiser criar diga não e você será levado para o menu principal',
      'possible_next_states': {
        'sim': async () => {
          await createRoom()

          Speech.speak(`Sala criada com sucesso, o nome da sala é ${useStore.getState().roomCode}`)

          await connectRoom()

          changeVoiceInterfaceState('admin_lobby')
        },
        'não': () => {
          changeVoiceInterfaceState('home')
        }
      }
    },
    'enter_room': {
      'message': 'Entrando em uma sala, qual seria o nome da sala que deseja entrar?',
      'possible_next_states': {
        'any': () => {
          changeRoomCode(stateRef.voiceResults[0])
          changeVoiceInterfaceState('confirm_room_code')
        }
      }
    },
    'confirm_room_code': {
      'message': `Diga sim para confirmar a entrada na sala de nome ${useStore.getState().roomCode}. Diga não para repetir o nome da sala.`,
      'possible_next_states': {
        'sim': async () => {
          Speech.speak('Procurando sala')
          
          await getRoom(useStore.getState().roomCode)

          await connectRoom()

          changeVoiceInterfaceState('player_lobby')

        },
        'não': () => {
          changeVoiceInterfaceState('enter_room')
        }
      }
    },
    'room_not_found': {
      'message': 'Sala não encontrada, Diga sim para tentar novamente ou diga não para sair e ir até o menu principal.',
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
      'message': 'Você está na sala esperando o jogo ser iniciado, caso queira sair da sala diga sair para voltar ao menu principal',
      'possible_next_states': {
        'sair': () => {
          changeVoiceInterfaceState('home')
          disconnectRoom()
        }
      }
    },
    'admin_lobby': {
      'message': 'Você é o dono da sala, para começar a partida diga iniciar, mas se quiser sair da sala diga sair. Vamos te notificar cada vez que um novo participante entrar ou sair da sala. Para mais informações sobre a sala diga informação',
      'possible_next_states': {
        'iniciar': () => {
          let roomId = useStore.getState().roomId
          initGame(roomId)
        },
        'informação': () => {
          Speech.speak(`O nome da sala é ${useStore.getState().roomCode}, no momento há ${useStore.getState().roomUserCount} jogadores na sala. A sala está aberta para jogadores entrarem`)
        },
        'sair': () => {
          changeVoiceInterfaceState('home')
          disconnectRoom()
        }
      }
    },
    'game': {
      'message': 'O jogo foi iniciado. Eu vou ler as perguntas para você e você me responde sempre dizendo letra A, B, C ou D. Ou seja, sempre a palavra letra e em seguida a letra que você deseja. Exemplo de resposta: letra A. Se não quiser ouvir essa introdução da próxima vez basta me interromper e dizer pular.',
      'possible_next_states': {
        'pular': () => {
          changeVoiceInterfaceState('read_question')
        }
      }
    },
    'read_question': {
      'message': `${ read_current_question() }`,
      'possible_next_states': {
        'letra a': () => {
          setUserAnswer('first_alternative')
          changeVoiceInterfaceState('confirm_user_answer')
        },
        'letra b': () => {
          setUserAnswer('second_alternative')
          changeVoiceInterfaceState('confirm_user_answer')
        },
        'letra c': () => {
          setUserAnswer('third_alternative')
          changeVoiceInterfaceState('confirm_user_answer')
        },
        'letra d': () => {
          setUserAnswer('fourth_alternative')
          changeVoiceInterfaceState('confirm_user_answer')
        }
      }
    },
    'confirm_user_answer': {
      'message': `Sua resposta é a ${ currentUserAnswer() }? Diga sim ou não`,
      'possible_next_states': {
        'sim': () => {
          let roomId = useStore.getState().roomId
          let letter_answer = position_to_letter[stateRef.userAnswer]

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
      'message': `O jogo acabou, o placar final foi: ${ read_score_board() }. Diga jogar para começar uma nova partida ou diga sair para voltar ao menu principal.`,
      'possible_next_states': {
        'jogar': () => {
          let roomId = useStore.getState().roomId
          initGame(roomId)
        },
        'sair': () => {
          changeVoiceInterfaceState('home')
          disconnectRoom()
        }
      }
    }
  }

  // ========================================

  const [changeVoiceInterfaceState, voiceInterfaceState] = useStore((state) => [state.changeVoiceInterfaceState, state.voiceInterfaceState])
  const [voiceResults, setVoiceResults] = useState([])
  stateRef.voiceResults = voiceResults

  const startListening = async() => {
    if (voiceAccessibility) {
      await Voice.start('pt-BR')
    }
  }

  const stopSpeech = async() => {
    await Speech.stop()
  }

  const onSpeechError = () => {
    if (useStore.getState().voiceAccessibility) {
      let messages = [
        'Não consegui entender, poderia repetir?',
        'Por favor, repita o que você disse',
        'Desculpe, mas não entendi, poderia repetir por favor?',
        'Hmm não consegui compreender, repita por favor'
      ]

      const randomIndex = Math.floor(Math.random() * messages.length);
      const randomMessage = messages[randomIndex]
      console.log(`> ${randomMessage}`)
      Speech.speak(randomMessage)
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

    let voiceInterfaceState = useStore.getState().voiceInterfaceState
    let voice_state = possible_states[voiceInterfaceState]
    
    let repeatMessage = results['value'].map(((result) => {
      if (result.includes('repita') || result.includes('repetir')) {
        return true
      }
    }))[0]

    let helpMessage = results['value'].map(((result) => {
      if (result.includes('ajuda')) {
        return true
      }
    }))[0]

    let possible_answers = Object.keys(voice_state['possible_next_states'])

    let valid_answer_key = results['value'].map((result) => {
      if (possible_answers.includes(result)) {
        return result
      }
    })[0]

    let valid_answer = voice_state['possible_next_states'][valid_answer_key]
    let fallback_option = voice_state['possible_next_states']['any']
    
    let next_state = valid_answer || fallback_option
    if (repeatMessage == true) {
      changeVoiceInterfaceState(null)
      changeVoiceInterfaceState(voiceInterfaceState)
    } else if (helpMessage) {
      Speech.speak("Seja bem-vindo ao jogo de perguntas e respostas acessiveis. Em qualquer momento você pode dizer repita e eu vou repetir o que acabei de dizer e as opções para avançar.")
    } else if (next_state != undefined) {
      next_state()
    } else { 
      Speech.speak("Entendi o que você disse, mas não condiz com as opções. Se quiser, posso repetir as opções, para isso diga repita")
    }
  }

  useFocusEffect(
    useCallback(()=>{
      if (voiceInterfaceState != null && voiceAccessibility != false) {
        let voice_state = possible_states[voiceInterfaceState]

        Speech.speak(voice_state['message'])
        console.log(`> ${voice_state['message']}`)
        
        // if (voice_state.final_state != true){ 
        //   startListening()
        // }
      }
    }, [voiceInterfaceState])
  )

  useImperativeHandle(ref, () => ({
    startListening: startListening,
    stopSpeech: stopSpeech
  }));
})

export default VoiceInterface
