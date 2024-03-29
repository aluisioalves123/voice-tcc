import { Text, View, TouchableOpacity, Alert, Button } from 'react-native';
import { useState, useEffect } from 'react'
import useStore from '../store'

import { registerAnswer } from '../api/game'
import { disconnectRoom } from '../api/rooms'

const Game = ({ navigation }) => {

  const [currentQuestion, changeCurrentQuestion] = useStore(state => [state.currentQuestion, state.changeCurrentQuestion])
  const roomId = useStore(state => state.roomId)
  const scoreboard = useStore(state => state.scoreboard)

  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [optionSelected, setOptionSelected] = useState(false);

  const handleSelectAlternative = (alternative) => {
    if (optionSelected == false) {
      setSelectedAlternative(alternative);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAlternative == null) {
      Alert.alert('Erro', 'Por favor, selecione uma opção');
    }

    setOptionSelected(true)

    registerAnswer(selectedAlternative.position, roomId)
  };

  const handleRoomDisconnect = async () => {
    navigation.navigate('Home')
    changeCurrentQuestion(null)
    disconnectRoom()
  };

  useEffect(() => {
    if (scoreboard != null) {
      navigation.navigate("Scoreboard")
    }
  }, [scoreboard])

  useEffect(() => {
    if (currentQuestion != null) {
      setSelectedAlternative(null);
      setOptionSelected(false)
    }
  }, [currentQuestion])

  return (
    <View className="flex-1 bg-gray-100">
      {currentQuestion && (
        <>
          <Text className="text-xl font-bold text-center mt-8">{currentQuestion.question}</Text>
          <View className="flex flex-col mt-8">
            {currentQuestion.alternatives.map((alternative) => (
              <TouchableOpacity
                key={alternative.id}
                className={`rounded-lg p-4 mb-4 ${
                  selectedAlternative === alternative
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700'
                }`}
                onPress={() => handleSelectAlternative(alternative)}
              >
                <Text className="text-lg">{alternative.body}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {optionSelected === false && (
            <TouchableOpacity
              className="bg-blue-500 py-4 px-8 rounded-lg self-center mt-8"
              onPress={handleSubmitAnswer}
            >
              <Text className="text-white font-bold">Enviar</Text>
            </TouchableOpacity>
          )}
          

          {optionSelected === true && (
            <Text className="text-xl font-bold text-center">Resposta registrada, aguardando os outros jogadores</Text>
          )}

          <TouchableOpacity
            className="bg-blue-500 py-4 px-8 rounded-lg self-center mt-8"
            onPress={handleRoomDisconnect}
          >
            <Text className="text-white font-bold">Sair da sala</Text>
          </TouchableOpacity>
          
        </>
      )}
    </View>
  );
}

export default Game