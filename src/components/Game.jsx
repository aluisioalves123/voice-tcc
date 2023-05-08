import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react'
import useStore from '../store'

import { registerAnswer } from '../api/game'

const Game = ({ navigation }) => {

  const currentQuestion = useStore(state => state.currentQuestion)
  const roomId = useStore(state => state.roomId)
  const scoreboard = useStore(state => state.scoreboard)

  const [selectedAlternative, setSelectedAlternative] = useState(null);

  const handleSelectAlternative = (alternative) => {
    setSelectedAlternative(alternative);
  };

  const handleSubmitAnswer = () => {
    if (selectedAlternative == null) {
      Alert.alert('Erro', 'Por favor, selecione uma opção');
    }
    // Verifica se a alternativa selecionada é a correta
    const isCorrect = selectedAlternative.correct
    // Lógica para tratar a resposta do usuário (por exemplo, exibir uma mensagem de acerto ou erro)
    registerAnswer(selectedAlternative.position, roomId)

    // Reinicia o estado da alternativa selecionada
    setSelectedAlternative(null);
  };

  useEffect(() => {
    if (scoreboard != null) {
      navigation.navigate("Scoreboard")
    }
  }, [scoreboard])

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
          <TouchableOpacity
            className="bg-blue-500 py-4 px-8 rounded-lg self-center mt-8"
            onPress={handleSubmitAnswer}
          >
            <Text className="text-white font-bold">Enviar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default Game