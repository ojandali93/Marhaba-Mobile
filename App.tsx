import React from 'react';
import {View} from 'react-native';
import tailwind from 'twrnc';
import themeColors from './src/Utils/custonColors';
import BottomTabNavigation from './src/Navigation/BottomTabNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <View
        style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
        <BottomTabNavigation />
      </View>
    </SafeAreaProvider>
  );
}

export default App;
