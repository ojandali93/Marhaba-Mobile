import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronsLeft } from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';

interface MenuViewProps {
  updateTab: (tab: string) => void;
}

const TermsView = ({ updateTab }: MenuViewProps) => {
  return (
    <View style={tailwind`flex-1 pt-2`}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => updateTab('settings')}
        style={tailwind`flex-row items-center mb-4`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text style={[tailwind`text-2xl font-semibold ml-2`, { color: themeColors.primary }]}>
          Terms of Service
        </Text>
      </TouchableOpacity>

      {/* Scrollable Terms Content */}
      <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
        <Text style={tailwind`text-sm text-gray-700 mb-6 leading-6`}>
          Welcome to Marhaba. These Terms of Service ("Terms") govern your access and use of our mobile application, services, and content.

          {"\n\n"}1. **Eligibility**{"\n"}
          You must be 18 years or older to use Marhaba. By using the app, you confirm that you are legally eligible and meet all age and legal requirements.

          {"\n\n"}2. **Account Responsibility**{"\n"}
          You are responsible for maintaining the confidentiality of your login credentials. You agree not to share your account or impersonate others.

          {"\n\n"}3. **Acceptable Use**{"\n"}
          You agree to use Marhaba respectfully. Harassment, hate speech, spam, and fake profiles are strictly prohibited. We reserve the right to remove any account in violation.

          {"\n\n"}4. **User Content**{"\n"}
          You retain rights to the content you share on Marhaba. However, you grant us a non-exclusive, royalty-free license to use and display your content within the app.

          {"\n\n"}5. **Prohibited Activities**{"\n"}
          You agree not to engage in scraping, reverse-engineering, unauthorized advertising, or using Marhaba for unlawful purposes.

          {"\n\n"}6. **Termination**{"\n"}
          Marhaba may suspend or terminate your account if you violate these Terms or engage in harmful conduct.

          {"\n\n"}7. **Privacy**{"\n"}
          We value your privacy. Please review our Privacy Policy to understand how your information is collected, used, and protected.

          {"\n\n"}8. **Modifications**{"\n"}
          We may update these Terms from time to time. Continued use of Marhaba means you agree to the latest version of these Terms.

          {"\n\n"}9. **Disclaimers**{"\n"}
          Marhaba is provided "as is". We make no warranties regarding success, matches, or uninterrupted service.

          {"\n\n"}10. **Contact**{"\n"}
          For questions about these Terms, please contact us through the app's Contact Us page.

          {"\n\n"}By using Marhaba, you agree to these Terms of Service. Thank you for being part of our community.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsView;
