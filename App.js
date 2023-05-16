
import { TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './RootNavigation';

import AccessibilityConfiguration from './src/components/AccessibilityConfiguration'
import PlayerNameConfiguration from './src/components/PlayerNameConfiguration';
import Home from './src/components/Home';
import Lobby from './src/components/Lobby';
import EnterRoom from './src/components/EnterRoom';
import Game from './src/components/Game';
import Scoreboard from './src/components/Scoreboard';

import VoiceInterface from './src/components/VoiceInterface';
import MicrophoneButton from './src/components/MicrophoneButton';

import { useKeepAwake } from 'expo-keep-awake';

const Stack = createNativeStackNavigator()

export default function App() {

  const voiceInterfaceRef = useRef(null);

  const handlePress = () => {
    if (voiceInterfaceRef.current) {
      voiceInterfaceRef.current.stopSpeech();
      voiceInterfaceRef.current.startListening();
    }
  };
  
  useKeepAwake();

  return (
    <TouchableOpacity style={{ flex: 1 }} onPressIn={handlePress}>
      <NavigationContainer ref={navigationRef}>
        <VoiceInterface ref={voiceInterfaceRef} />
        <Stack.Navigator initialRouteName='AccessibilityConfiguration' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AccessibilityConfiguration" component={AccessibilityConfiguration}/>
          <Stack.Screen name="PlayerNameConfiguration" component={PlayerNameConfiguration}/>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Lobby" component={Lobby}/>
          <Stack.Screen name="EnterRoom" component={EnterRoom}/>
          <Stack.Screen name="Game" component={Game}/>
          <Stack.Screen name="Scoreboard" component={Scoreboard}/>
          <Stack.Screen name="MicrophoneButton" component={MicrophoneButton}/>
        </Stack.Navigator>
      </NavigationContainer>
    </TouchableOpacity>
  )
}
