import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {ChevronsLeft} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import axios from 'axios';
import {useProfile} from '../../Context/ProfileContext';
import {useNavigation} from '@react-navigation/native';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSpacing = 12;
const imageSize = (screenWidth - itemSpacing * (numColumns + 1)) / numColumns;

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const ViewedView = ({updateTab}: MenuViewProps) => {
  const {profile} = useProfile();
  const navigation = useNavigation();
  const [viewed, setViewed] = useState<any[]>([]);

  useEffect(() => {
    grabUserViewed();
  }, []);

  const grabUserViewed = async () => {
    try {
      const response = await axios.get(
        `https://marhaba-server.onrender.com/api/viewed/user/${profile.userId}`,
      );
      if (response.data.success) {
        setViewed(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={tailwind`flex-1 pt-2`}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => updateTab('profile')}
        style={tailwind`flex-row items-center mb-4`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text
          style={[
            tailwind`text-2xl font-semibold ml-2`,
            {color: themeColors.primary},
          ]}>
          Profile
        </Text>
      </TouchableOpacity>

      {/* Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: itemSpacing / 2,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {viewed.map((item, index) => {
          const photoUrl = item?.ViewedProfile?.Photos?.[0]?.photoUrl;
          const name = item?.ViewedProfile?.name;

          if (!photoUrl) return null;

          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                navigation.navigate('SingleProfile', {
                  profile: item.ViewedProfile,
                })
              }
              style={{
                width: '49%',
                height: imageSize * 1.3,
                marginBottom: itemSpacing,
                borderRadius: 12,
                overflow: 'hidden',
              }}>
              <Image
                source={{uri: photoUrl}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
              <View
                style={tailwind`absolute bottom-0 left-0 right-0 bg-black/50 p-2`}>
                <Text style={tailwind`text-white text-lg font-bold`}>
                  {name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ViewedView;
