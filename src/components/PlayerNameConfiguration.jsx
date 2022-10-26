import { SafeAreaView, Text, Button, View , TextInput} from 'react-native';
import { useState } from 'react'

import useStore from '../store'

const PlayerNameConfiguration = ({ navigation }) => {

  const microphoneNavigation = useStore((state) => state.microphoneNavigation)
  const changePlayerName = useStore((state) => state.changePlayerName)
  const [text, setText] = useState(null)

  const setPlayerName = () => {
    changePlayerName(text)
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Configuração de acessibilidade</Text>
      <TextInput className='p-3 mb-2 border border-gray-200 rounded-lg' 
        placeholder="Jogador, qual é o seu nome?" 
        onChangeText={(text) => setText(text)} />
      <Button title='Confirmar' onPress={() => setPlayerName()} />
    </SafeAreaView>
  );
}

export default PlayerNameConfiguration