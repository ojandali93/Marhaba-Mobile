import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import tailwind from 'twrnc';
import {Check, Heart, Settings, Sliders, X} from 'react-native-feather';

import themeColors from '../../Utils/custonColors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useProfile} from '../../Context/ProfileContext';
import useLocation from '../../Services/LocationServices';
import {getLocation} from '../../Services/LocationServices';
import FilterModal from '../../Components/Modals/FilterModal';

interface Interaction {
  _id: string;
  liker: {
    _id: string;
    name?: string;
    Photos?: {photoUrl: string}[];
  };
  interaction: 'liked' | 'superliked';
}

interface ProcessedInteraction extends Interaction {
  isSuperLike: boolean;
}

const {width} = Dimensions.get('window');
const itemPadding = 8;
const numColumns = 2;
const imageSize = (width - itemPadding * (numColumns + 1)) / numColumns;

const SearchScreent = () => {
  const {profile, userId, location} = useProfile();
  const {region, requestPermissions} = useLocation(); // use the right method name
  const navigation = useNavigation();

  const [ageMin, setAgeMin] = useState<number>(18);
  const [ageMax, setAgeMax] = useState<number>(100);
  const [gender, setGender] = useState<string>('male');
  const [background, setBackground] = useState<string[]>([]);
  const [distance, setDistance] = useState<string>('Close (50 miles)');
  const [religion, setReligion] = useState<string[]>([]);
  const [sect, setSect] = useState<string[]>([]);
  const [views, setViews] = useState<string[]>([]);
  const [smoke, setSmoke] = useState<string[]>([]);
  const [drink, setDrink] = useState<string[]>([]);
  const [hasKids, setHasKids] = useState<string[]>([]);
  const [wantsKids, setWantsKids] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string[]>([]);
  const [relocate, setRelocate] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 100]);

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<ProcessedInteraction[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers]),
  );

  useEffect(() => {
    if (DISTANCE_MAP[profile.Preferences[0].distance]) {
      fetchUsers();
    }
  }, [profile]);

  const onRefresh = useCallback(() => {
    fetchUsers();
  }, [isRefreshing]);

  const DISTANCE_MAP = {
    'Close (50 miles)': 50,
    'Nearby (100 miles)': 100,
    'Far (150 miles)': 150,
    'Everywhere (500+ miles)': 2000,
  };

  useEffect(() => {
    setAgeMin(ageRange[0]);
    setAgeMax(ageRange[1]);
  }, [ageRange]);

  const initializeFilters = () => {
    const preferences = profile.Preferences?.[0];
    if (!preferences) return;

    setAgeMin(preferences.ageMin || 18);
    setAgeMax(preferences.ageMax || 100);
    setGender(
      preferences.gender.charAt(0).toUpperCase() +
        preferences.gender.slice(1) || 2000,
    );
    setDistance(preferences.distance || 'Close (50 miles)');
    setBackground(toArray(preferences.background));
    setReligion(toArray(preferences.religion));
    setSect(toArray(preferences.sect));
    setViews(toArray(preferences.views));
    setSmoke(toArray(preferences.smoke));
    setDrink(toArray(preferences.drink));
    setHasKids(toArray(preferences.hasKids));
    setWantsKids(toArray(preferences.wantsKids));
    setLookingFor(toArray(preferences.lookingFor));
    setTimeline(toArray(preferences.timeline));
    setRelocate(toArray(preferences.relocate));
    setAgeRange([preferences.ageMin, preferences.ageMax] || [18, 100]);
    setLoading(true);
  };

  const toArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value]; // if it's a single string, wrap it
  };

  const fetchUsers = async () => {
    const currentDistance = DISTANCE_MAP[distance];
    try {
      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/user/filterProfiles',
        {
          userId,
          ageMin,
          ageMax,
          gender: gender.charAt(0).toUpperCase() + gender.slice(1),
          background,
          religion,
          sect,
          views,
          smoke,
          drink,
          hasKids,
          wantsKids,
          lookingFor,
          timeline,
          relocate,
          distance: currentDistance,
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
      );

      if (response.data?.success) {
        setUsers(response.data.data);
        setIsRefreshing(false);
      } else {
        setUsers([]);
        setIsRefreshing(false);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      setIsRefreshing(false);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderGridItem = ({item}) => {
    const profilePicUrl = item.Photos?.[0]?.photoUrl;

    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate('SingleProfileSearch', {profile: item})
        }>
        <View style={styles.gridItem}>
          <Image
            source={{uri: profilePicUrl}}
            style={styles.profileImage}
            resizeMode="cover"
            blurRadius={0}
          />
          <Text
            style={tailwind`absolute bottom-0 left-0 p-3 text-white text-xl font-bold`}>
            {item.name}
          </Text>
          <Text
            style={tailwind`absolute bottom-0 right-0 p-3 text-white text-xl font-bold`}>
            {calculateAge(item.dob)} yrs
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={tailwind`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      );
    }
    if (error && !isRefreshing) {
      return (
        <View style={tailwind`flex-1 justify-center items-center p-5`}>
          <Text style={tailwind`text-red-500 text-center`}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchLikes(false)}
            style={tailwind`mt-4 p-2 bg-gray-200 rounded`}>
            <Text>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (users.length === 0 && !isRefreshing) {
      return (
        <ScrollView
          contentContainerStyle={tailwind`flex-1 justify-center items-center p-5`}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={themeColors.primary}
            />
          }>
          <Text style={tailwind`text-lg text-gray-500 text-center`}>
            No one has liked you yet.
          </Text>
          <Text style={tailwind`text-gray-400 text-center mt-1`}>
            Check back later!
          </Text>
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={users}
        renderItem={renderGridItem}
        keyExtractor={item => item._id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={themeColors.primary}
            colors={[themeColors.primary]}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView
      style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View
        style={[
          tailwind`w-full flex flex-row items-center justify-between px-4 p-4 rounded-2 mb-3`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>Search</Text>
        <TouchableOpacity
          onPress={() => {
            setShowFilterModal(!showFilterModal);
          }}>
          <Sliders height={22} width={22} color={themeColors.primary} />
        </TouchableOpacity>
      </View>

      {renderContent()}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onReset={() => {
          setIsRefreshing(true);
        }}
        onApply={() => {
          fetchUsers();
          setShowFilterModal(false);
        }}
        gender={gender}
        setGender={setGender}
        distance={distance}
        setDistance={setDistance}
        ageRange={ageRange}
        setAgeRange={setAgeRange}
        religion={religion}
        setReligion={setReligion}
        background={background}
        setBackground={setBackground}
        sect={sect}
        setSect={setSect}
        views={views}
        setViews={setViews}
        smoke={smoke}
        setSmoke={setSmoke}
        drink={drink}
        setDrink={setDrink}
        hasKids={hasKids}
        setHasKids={setHasKids}
        wantsKids={wantsKids}
        setWantsKids={setWantsKids}
        lookingFor={lookingFor}
        setLookingFor={setLookingFor}
        timeline={timeline}
        setTimeline={setTimeline}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: itemPadding / 2,
    paddingBottom: itemPadding / 2,
    flexGrow: 1,
  },
  gridItem: {
    width: imageSize,
    height: imageSize * 1.25,
    margin: itemPadding / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  superLikeIndicator: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 4,
  },
  nameText: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});

export default SearchScreent;
