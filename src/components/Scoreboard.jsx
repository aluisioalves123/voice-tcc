import { SafeAreaView, Text, Button, View } from 'react-native';
import useStore from '../store'
import { disconnectRoom } from '../api/rooms'
import { initGame } from '../api/game'


const Scoreboard = ({ navigation }) => {
  const roomId = useStore((state) => state.roomId)
  const [scoreboard, setScoreboard] = useStore((state) => [state.scoreboard, state.changeScoreboard])

  const handleRoomDisconnect = async () => {
    navigation.navigate('Home')
    changeCurrentQuestion(null)
    setScoreboard(null)
    disconnectRoom()
  };

  const handlePlayAgain = async () => {
    initGame(roomId)
    navigation.navigate('Game')
    setScoreboard(null)
  };
  

  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-100'>
      {
        Object.keys(scoreboard).map((key, index) => (
          <Text key={index}>{key}: {scoreboard[key]}</Text>
        ))
      }
      <Button title='Jogar novamente' onPress={handlePlayAgain} />
      <Button title='Sair' onPress={handleRoomDisconnect} />
    </SafeAreaView>
  );
}

export default Scoreboard