import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from './src/Utils/custonColors';
import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSessionCheck} from './src/Hooks/useSessionCheck';
import LoginScreen from './src/Screens/LoginScreen';

function App(): React.JSX.Element {
  const isAuthenticated = useSessionCheck();

  return (
    <SafeAreaProvider>
      <View
        style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
        {isAuthenticated ? (
          <BottomTabNavigation />
        ) : (
          <View style={tailwind`w-full h-full`}>
            <LoginScreen />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

export default App;
