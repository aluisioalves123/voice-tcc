import { SafeAreaView, Text, Button, View } from 'react-native';

import useStore from '../store'
import { connectRoom, createRoom } from '../api/rooms'

const Home = ({ navigation }) => {

  const handleRoomCreation = async () => {
    await createRoom()
    await connectRoom()
    navigation.navigate('Lobby')
  };

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Jogo do Milhão</Text>
      <Button title='Entrar em uma sala' onPress={() => navigation.navigate('EnterRoom')} />
      <Button title='Criar uma sala' onPress={handleRoomCreation} />
    </SafeAreaView>
  );
}

export default Home