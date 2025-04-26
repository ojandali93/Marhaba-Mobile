import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import tailwind from 'twrnc';
import {
  Check,
  GlassWater,
  Heart,
  X,
  ArrowLeft,
  ChevronsDown,
} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import cheers from '../../Assets/cheers.png';
import baby from '../../Assets/baby.png';
import ciggy from '../../Assets/cigarette.png';
import {countryFlagMap} from '../../Utils/FlagMaps';

interface FeedSummaryProps {
  profile: any;
  likesLeft?: number; // 👈 Optional prop for number of likes remaining
}

const FeedProfileComponent: React.FC<FeedSummaryProps> = ({
  profile, // 👈 Default value if not passed
}) => {
  if (!profile?.data) return null;

  const user = profile.data;
  const about = user.About?.[0];
  const career = user.Career?.[0];
  const photoUrl = user.Photos?.[0]?.photoUrl;
  const name = user.name;
  const age = user.dob ? getAgeFromDOB(user.dob) : '—';
  const drink = about?.drink;
  const smoke = about?.smoke;
  const hasKids = about?.hasKids;
  const background = about?.background;
  const religion = about?.religion;
  const job = career?.job;
  const height = user?.height;
  const lookingFor = about?.lookingFor;
  const timeline = about?.timeline;
  const sect = about?.sect;
  const prompt = user.Prompts?.[0];
  const tags = user.Tags?.map(t => t.tag) || [];

  return (
    <View style={tailwind`flex-1 relative`}>
      {/* Background Image */}
      <Image
        source={{uri: photoUrl}}
        style={tailwind`absolute w-full h-full`}
        resizeMode="cover"
      />
      {/* Info Box */}
      <View
        style={[
          tailwind`absolute bottom-6 left-4 right-4 rounded-8 p-4 pb-18`,
          {backgroundColor: 'rgba(214, 203, 182, .8)'},
        ]}>
        {/* Profile Header */}
        <View style={tailwind`flex-row justify-between items-center`}>
          <View style={tailwind`flex-row justify-between w-full`}>
            <View
              style={tailwind`w-full flex flex-row justify-between items-end`}>
              <Text style={tailwind`text-3xl font-bold text-green-900`}>
                {name} {`(${age})`}
              </Text>
              <Text style={tailwind`text-3xl font-semibold`}>
                {countryFlagMap[background]}
              </Text>
            </View>
            <View>
              <></>
            </View>
          </View>
        </View>

        {/* Profile Details */}
        <View style={tailwind`mt-3`}>
          <Text style={tailwind`text-lg`}>
            {height ? `${height} ${' • '}` : null} {religion}{' '}
            {sect ? `${' • '} ${sect}` : null} {' • '} {job}
          </Text>
        </View>
        <View style={tailwind`mt-2`}>
          <Text style={tailwind`font-semibold text-lg`}>
            {lookingFor} {' • '} {timeline}
          </Text>
        </View>

        <View style={tailwind`mt-2 w-full flex flex-row items-center`}>
          {drink && (
            <View style={tailwind`flex flex-row items-center`}>
              <Image style={tailwind`h-6 w-6`} source={cheers} />
              <Text style={tailwind`text-lg ml-2`}>
                {drink}
                {'  •  '}
              </Text>
            </View>
          )}
          {smoke && (
            <View style={tailwind`flex flex-row items-center`}>
              <Image style={tailwind`h-6 w-6`} source={ciggy} />
              <Text style={tailwind`text-lg ml-2`}>
                {smoke}
                {'  •  '}
              </Text>
            </View>
          )}
          {hasKids === 'Yes' && (
            <View style={tailwind`flex flex-row items-center`}>
              <Image style={tailwind`h-6 w-6`} source={baby} />
              <Text style={tailwind`text-lg ml-2`}>{hasKids}</Text>
            </View>
          )}
        </View>

        {/* Prompts */}
        <View style={tailwind`mt-2`}>
          <Text style={tailwind`text-lg italic`}>{`${prompt?.prompt}`}</Text>
        </View>
        <View style={tailwind``}>
          <Text style={tailwind`font-semibold text-lg`}>
            {`"${prompt?.response}"`}
          </Text>
        </View>

        {/* Tags */}
        {tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tailwind`mt-3`}>
            {tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  tailwind`px-4 py-1 mr-2 rounded-full border`,
                  {
                    borderColor: themeColors.primary,
                    backgroundColor: themeColors.darkSecondary,
                    borderWidth: 1,
                  },
                ]}>
                <Text style={tailwind`text-green-900 font-semibold`}>
                  {tag}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Like / Dislike / Superlike Buttons */}
        <View
          style={tailwind`w-full flex flex-row items-center justify-between mt-4`}>
          <View>
            <View style={tailwind`p-3 rounded-full bg-neutral-200`}>
              <ChevronsDown
                height={22}
                width={22}
                color={'black'}
                strokeWidth={3}
              />
            </View>
          </View>
          <View style={tailwind`flex flex-row items-center`}>
            <View style={tailwind`p-3 rounded-full bg-red-400`}>
              <X height={22} width={22} color={'white'} strokeWidth={3} />
            </View>
            <View style={tailwind`p-3 rounded-full bg-emerald-400 ml-3`}>
              <Check height={22} width={22} color={'white'} strokeWidth={3} />
            </View>
            <View
              style={[
                tailwind`p-4 rounded-full ml-3`,
                {backgroundColor: themeColors.primary},
              ]}>
              <Heart height={28} width={28} color={'white'} strokeWidth={3} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Helper function
function getAgeFromDOB(dobString: string) {
  const birthDate = new Date(dobString);
  const ageDiff = Date.now() - birthDate.getTime();
  return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
}

export default FeedProfileComponent;
