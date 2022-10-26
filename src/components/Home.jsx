import { SafeAreaView, Text, Button, View } from 'react-native';

import useStore from '../store'

const Home = ({ navigation }) => {

  const microphoneNavigation = useStore((state) => state.microphoneNavigation)

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      <Text className='text-lg'>Quizz Show</Text>
      <Button title='Entrar em uma sala'/>
      <Button title='Criar uma sala'/>
      <Button title='Tutorial'/>
    </SafeAreaView>
  );
}

export default Home