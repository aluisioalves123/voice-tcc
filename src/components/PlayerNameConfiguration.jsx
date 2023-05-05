import { View, Button, TextInput, Alert} from 'react-native';
import { useState } from 'react'

import { createUser } from '../api/users'

import useStore from '../store'
const PlayerNameConfiguration = ({ navigation }) => {
  const changePlayerName = useStore((state) => state.changePlayerName)

  const [name, setName] = useState('');

  const handlePress = () => {
    if (name.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha seu nome');
      return;
    }
    changePlayerName(name)
    createUser(name)
    navigation.navigate('Home')
  };

  return (
    <View className='flex-1 items-center justify-center bg-gray-100'>
      <TextInput  
        className='p-3 rounded border w-80 mb-2'
        placeholder="Digite seu nome"
        onChangeText={setName}
        value={name}
      />
      <Button title="Enviar" onPress={handlePress} />
    </View>
  );
}

export default PlayerNameConfiguration

