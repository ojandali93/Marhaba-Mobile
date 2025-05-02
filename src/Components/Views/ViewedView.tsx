import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { ChevronsLeft } from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import axios from 'axios';
import { useProfile } from '../../Context/ProfileContext';
import { useNavigation } from '@react-navigation/native';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemSpacing = 12;
const imageSize = (screenWidth - itemSpacing * (numColumns + 1)) / numColumns;

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const ViewedView = ({ updateTab }: MenuViewProps) => {
  const { profile } = useProfile();
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

  const renderItem = ({ item }: { item: any }) => {
    const photoUrl = item?.ViewedProfile?.Photos?.[0]?.photoUrl;

    if (!photoUrl) return null;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('SingleProfile', { profile: item.ViewedProfile })}
        style={tailwind`w-1/2 h-64 p-.5 rounded-5 overflow-hidden`}>
        <Image
          source={{ uri: photoUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <View style={tailwind`absolute bottom-.5 left-.5 right-.5 top-.5 p-3 bg-black/50 flex flex-col justify-end`}>
            <Text style={tailwind`text-white text-2xl font-bold`}>{item.ViewedProfile.name}</Text>
        </View>
      </TouchableOpacity>
    );
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
            { color: themeColors.primary },
          ]}>
          Profile
        </Text>
      </TouchableOpacity>

      {/* Grid of viewed users */}
      <FlatList
        data={viewed}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        numColumns={numColumns}
        contentContainerStyle={{
          padding: itemSpacing / 2,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ViewedView;
