import React from 'react';
import {Text, View} from 'react-native';
import tailwind from 'twrnc';

const HomeScreen = () => {
  return (
    <View style={tailwind`w-full h-full`}>
      <Text>Marhaba</Text>
    </View>
  );
};

export default HomeScreen;
