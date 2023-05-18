import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MicrophoneButton = () => {
  return (
    <View className="flex flex-col items-center justify-center h-full" accessible={false} >
      <View className={`flex items-center justify-center bg-blue-500 rounded-full w-60 h-60`}
            accessible={true}
            accessibilityLabel="Aperte duas vezes em qualquer lugar da tela para falar, se precisar de ajuda diga AJUDA">
        <Ionicons name="mic" size={80} color="#FFFFFF" accessible={false}/>
      </View>
      <Text className="text-lg text-center mt-2">
        Aperte duas vezes em qualquer lugar da tela para falar, se precisar de ajuda diga AJUDA
      </Text>
    </View>
  );
};

export default MicrophoneButton;