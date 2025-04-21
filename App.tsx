import React from 'react';
import {View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from './src/Utils/custonColors';
import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSessionCheck} from './src/Hooks/useSessionCheck';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/Navigation/AuthStackNavigation';

function App(): React.JSX.Element {
  const isAuthenticated = useSessionCheck();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? <BottomTabNavigation /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
