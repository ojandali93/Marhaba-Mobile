import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tailwind from 'twrnc';
import {tutorialScreens} from '../../Utils/SelectOptions';
import themeColors from '../../Utils/custonColors';
import {ChevronsDown} from 'react-native-feather';
import * as IconSet from 'react-native-feather';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';
const arrowPositionsPercent: Record<string, number> = {
  Feed: 0.06,
  Likes: 0.27,
  Recommended: 0.45,
  Chat: 0.64,
  Profile: 0.82,
};

const TutorialModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const {userId} = useProfile();
  const [page, setPage] = useState(0);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  const {icon, title, description, key} = tutorialScreens[page];
  const screenWidth = Dimensions.get('window').width;
  const IconComponent = icon && IconSet[icon] ? IconSet[icon] : null;

  const handleNext = async () => {
    if (page < tutorialScreens.length - 1) {
      setPage(page + 1);
    } else {
      if (doNotShowAgain) {
        await AsyncStorage.setItem('tutorial_skipped', 'true');
      }
      onClose();
    }
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  const handleDone = async () => {
    try {
      const response = await axios.put(
        'https://marhaba-server.onrender.com/api/user/tutorial',
        {
          userId,
          tutorial: !doNotShowAgain,
        },
      );
      if (response.status === 200) {
        onClose();
      } else {
        console.error('Error setting tutorial skipped:', response.data);
      }
    } catch (error) {
      console.error('Error setting tutorial skipped:', error);
    }
  };

  const renderArrow = () => {
    const percent = arrowPositionsPercent[title];
    if (percent === undefined) return null;

    const left = screenWidth * percent;

    return (
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 100,
          left,
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{translateY}],
        }}>
        <ChevronsDown height={40} width={40} color={'white'} />
        <ChevronsDown
          height={40}
          width={40}
          style={tailwind`mt--4`}
          color={'white'}
        />
      </Animated.View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-60 px-6`}>
        <View
          style={[
            tailwind`bg-white flex-col justify-between rounded-2xl h-1/3 p-6 w-full`,
            {maxHeight: '85%'},
          ]}>
          <View>
            {IconComponent && (
              <View style={tailwind`flex-row justify-center items-center`}>
                <IconComponent
                  height={50}
                  width={50}
                  color={themeColors.primary}
                />
              </View>
            )}
            <Text style={tailwind`text-2xl font-bold text-center mt-3 mb-2`}>
              {title}
            </Text>
          </View>

          <Text style={tailwind`text-base text-center mb-4 text-gray-700`}>
            {description}
          </Text>

          <View style={tailwind`flex-row justify-between items-center mt-4`}>
            {/* Back/Skip buttons */}
            {page > 0 && key !== 'welcome' && key !== 'enjoy' ? (
              <TouchableOpacity
                onPress={handleBack}
                style={tailwind`px-4 py-2`}>
                <Text style={tailwind`text-gray-600 text-base`}>Back</Text>
              </TouchableOpacity>
            ) : key === 'welcome' ? (
              <View style={tailwind`px-4 py-2`} />
            ) : key === 'enjoy' ? (
              <View style={tailwind`flex-row items-center justify-center mb-2`}>
                <View style={{transform: [{scaleX: 0.85}, {scaleY: 0.85}]}}>
                  <Switch
                    value={doNotShowAgain}
                    onValueChange={setDoNotShowAgain}
                    trackColor={{false: '#ccc', true: themeColors.primary}}
                    thumbColor={
                      doNotShowAgain ? themeColors.primary : '#f4f3f4'
                    }
                  />
                </View>
                <Text style={tailwind`ml-2 text-gray-700`}>
                  Don’t show again
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSkip}
                style={tailwind`px-4 py-2`}>
                <Text style={tailwind`text-gray-600 text-base`}>Skip</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={
                page === tutorialScreens.length - 1 ? handleDone : handleNext
              }
              style={[
                tailwind`px-4 py-2 rounded-lg`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Text style={tailwind`text-white text-base`}>
                {page === tutorialScreens.length - 1 ? 'Done' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderArrow()}
      </View>
    </Modal>
  );
};

export default TutorialModal;
