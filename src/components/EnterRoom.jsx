import { SafeAreaView, Text, Button, TextInput} from 'react-native';
import { useState } from 'react'
import { connectRoom, getRoom } from '../api/rooms'

import useStore from '../store'

const EnterRoom = ({ navigation }) => {
  const [tempRoomCode, setTemproomCode] = useState('')
  const [roomCode, changeRoomCode] = useStore((state) => [state.roomCode, state.changeRoomCode])

  const handleRoomConnect = async () => {
    if (tempRoomCode.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o nome da sala');
      return;
    }
    changeRoomCode(tempRoomCode)
    await getRoom(tempRoomCode)
    await connectRoom()
    navigation.navigate('Lobby')
  };

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Nome da sala</Text>
      <TextInput className='p-3 rounded border w-80 mb-2' value={tempRoomCode} onChangeText={setTemproomCode}></TextInput>
      <Button title='Entrar' onPress={handleRoomConnect}></Button>
      <Button title='Sair' onPress={() => navigation.navigate("Home")}/>
    </SafeAreaView>
  );
}

export default EnterRoom