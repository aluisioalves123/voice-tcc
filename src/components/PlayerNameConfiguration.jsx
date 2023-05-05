import { View, Button, TextInput} from 'react-native';
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
    <View>
      <TextInput
        placeholder="Digite seu nome"
        onChangeText={setName}
        value={name}
      />
      <Button title="Enviar" onPress={handlePress} />
    </View>
  );
}

export default PlayerNameConfiguration

