import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronsLeft } from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const PrivacyView = ({ updateTab }: MenuViewProps) => {
  return (
    <View style={tailwind`flex-1 pt-2`}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => updateTab('settings')}
        style={tailwind`flex-row items-center mb-4`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text style={[tailwind`text-2xl font-semibold ml-2`, { color: themeColors.primary }]}>
          Privacy Policy
        </Text>
      </TouchableOpacity>

      {/* Scrollable Privacy Policy Content */}
      <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
        <Text style={tailwind`text-sm text-gray-700 mb-6 leading-6`}>
          This Privacy Policy explains how Marhaba ("we", "our", or "us") collects, uses, and protects your personal information when you use our mobile application and services.

          {"\n\n"}1. **Information We Collect**{"\n"}
          We collect personal information you voluntarily provide when signing up, including your name, email address, birth date, gender, profile photos, and preferences. We also collect usage data such as your interactions, messages, likes, and logins.

          {"\n\n"}2. **Use of Information**{"\n"}
          We use your data to match you with other users, personalize your experience, process feedback, prevent fraud, and communicate important updates. We may use anonymized data to improve app functionality and features.

          {"\n\n"}3. **Sharing of Information**{"\n"}
          We do not sell your personal information. We may share data with trusted partners for hosting, analytics, or customer support purposes — all under strict confidentiality agreements.

          {"\n\n"}4. **Your Messages and Photos**{"\n"}
          Messages are stored securely and only visible to you and your matched users. Photos uploaded are publicly visible to users based on your privacy settings.

          {"\n\n"}5. **Cookies and Analytics**{"\n"}
          We use analytics tools and may collect device data like IP address, OS type, and usage patterns to understand user behavior and improve performance.

          {"\n\n"}6. **Security**{"\n"}
          We implement reasonable safeguards to protect your information. However, no system is 100% secure. Use strong passwords and report any suspicious activity.

          {"\n\n"}7. **Your Rights**{"\n"}
          You may request to view, update, or delete your data at any time by contacting support through the app. You can also deactivate your account at any time in your settings.

          {"\n\n"}8. **Children's Privacy**{"\n"}
          Marhaba is not intended for users under 18. We do not knowingly collect data from minors.

          {"\n\n"}9. **Third-Party Services**{"\n"}
          Our app may link to third-party services or social media logins. We are not responsible for their privacy practices. Please review their policies separately.

          {"\n\n"}10. **Policy Changes**{"\n"}
          We may update this Privacy Policy from time to time. Material changes will be communicated in the app or via email.

          {"\n\n"}11. **Contact**{"\n"}
          If you have any questions about this Privacy Policy, please reach out to us through the app’s Contact Us form.

          {"\n\n"}By using Marhaba, you agree to the collection and use of your information in accordance with this Privacy Policy.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyView;
