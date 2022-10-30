
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccessibilityConfiguration from './src/components/AccessibilityConfiguration'
import PlayerNameConfiguration from './src/components/PlayerNameConfiguration';

const Stack = createNativeStackNavigator()

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='AccessibilityConfiguration' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AccessibilityConfiguration" component={AccessibilityConfiguration}/>
        <Stack.Screen name="PlayerNameConfiguration" component={PlayerNameConfiguration}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
