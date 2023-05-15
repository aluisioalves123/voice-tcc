import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MicrophoneButton = () => {
  return (
    <View className="flex flex-col items-center justify-center h-full">
      <View className={`flex items-center justify-center bg-blue-500 rounded-full w-60 h-60`}>
        <Ionicons name="mic" size={80} color="#FFFFFF" />
      </View>
    </View>
  );
};

export default MicrophoneButton;