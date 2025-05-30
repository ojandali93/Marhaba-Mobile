import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ChevronsLeft} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {WebView} from 'react-native-webview';

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const EULAView = ({updateTab}: MenuViewProps) => {
  return (
    <View style={tailwind`flex-1 pt-2`}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => updateTab('settings')}
        style={tailwind`flex-row items-center mb-4 px-4`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text
          style={[
            tailwind`text-2xl font-semibold ml-2`,
            {color: themeColors.primary},
          ]}>
          Terms of Service
        </Text>
      </TouchableOpacity>

      {/* WebView to load EULA */}
      <WebView
        source={{
          uri: 'https://app.termly.io/policy-viewer/policy.html?policyUUID=6c415447-ebe1-4647-9104-e89d1c3879c8',
        }}
        style={tailwind`flex-1`}
      />
    </View>
  );
};

export default EULAView;
