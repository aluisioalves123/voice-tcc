
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './RootNavigation';

import AccessibilityConfiguration from './src/components/AccessibilityConfiguration'
import PlayerNameConfiguration from './src/components/PlayerNameConfiguration';
import Home from './src/components/Home';
import Lobby from './src/components/Lobby';
import EnterRoom from './src/components/EnterRoom';
import Game from './src/components/Game';

import VoiceInterface from './src/components/VoiceInterface';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <VoiceInterface />
      <Stack.Navigator initialRouteName='AccessibilityConfiguration' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AccessibilityConfiguration" component={AccessibilityConfiguration}/>
        <Stack.Screen name="PlayerNameConfiguration" component={PlayerNameConfiguration}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Lobby" component={Lobby}/>
        <Stack.Screen name="EnterRoom" component={EnterRoom}/>
        <Stack.Screen name="Game" component={Game}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
