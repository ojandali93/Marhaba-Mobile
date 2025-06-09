import React, {useCallback, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import tailwind from 'twrnc';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ChevronsLeft, ChevronsRight} from 'react-native-feather';
import themeColors from '../../Utils/custonColors';
import {useProfile} from '../../Context/ProfileContext';
import BillingModalContent from '../../Components/Modals/BillingModalContent';
import RestorePurchaseModalContent from '../../Components/Modals/RestorePurchaseModalContent';
import VerifyModalContent from '../../Components/Modals/VerifyModalContent';
import EmailModalContent from '../../Components/Modals/EmailModalContent';
import PasswordModalContent from '../../Components/Modals/PasswordModalContent';
import PhoneModalContent from '../../Components/Modals/PhoneModalContent';
import PastTransactionsModalContent from '../../Components/Modals/PastTransactionsModalContent';
import axios from 'axios';

const SubSettingsScreen = () => {
  const navigation = useNavigation();
  const {profile, checkActiveSubscription} = useProfile();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const openLink = (url: string) => Linking.openURL(url);

  useFocusEffect(
    useCallback(() => {
      checkActiveSubscription(profile.userId, profile);
    }, [profile.userId, profile]),
  );

  const updatePasswordViaServer = async () => {
    if (newPassword !== verifyPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    console.log(profile?.email, password, newPassword);

    try {
      const response = await axios.post(
        'https://marhaba-server.onrender.com/api/auth/updatePassword',
        {email: profile?.email, currentPassword: password, newPassword},
      );

      if (response.status === 200) {
        setActiveModal(null);
        Alert.alert('Password updated successfully');
      } else {
        Alert.alert('Failed to update password');
      }
    } catch (error) {
      console.error(
        '❌ Server error:',
        error.response?.data?.error || error.message,
      );
      return {success: false, error: error.message};
    }
  };

  const getPlanName = () => {
    switch (profile?.tier) {
      case 1:
        return 'Marhabah Free';
      case 2:
        return 'Marhabah Pro';
      case 3:
        return 'Marhabah Pro+';
      default:
        return 'Unknown';
    }
  };

  const openManageSubscriptions = () => {
    Linking.openURL('https://apps.apple.com/account/subscriptions').catch(err =>
      console.error('Failed to open subscriptions URL:', err),
    );
  };

  return (
    <View style={[tailwind`flex-1`, {backgroundColor: themeColors.secondary}]}>
      <View
        style={[
          tailwind`w-full flex-row items-center pr-4 pl-2 py-2 rounded-2 mb-3 mt-14`,
          {backgroundColor: themeColors.secondary},
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronsLeft height={24} width={24} color={'black'} />
        </TouchableOpacity>
        <Text style={tailwind`text-2xl font-bold text-gray-800`}>Settings</Text>
      </View>
      <ScrollView style={tailwind`flex-1 mb-22 mx-2`}>
        <Text style={tailwind`text-xl font-semibold text-gray-500 my-3`}>
          Account:
        </Text>

        {/* Edit Email */}
        <View
          style={[
            tailwind`flex-row justify-between items-center p-4 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Email:</Text>
          <Text style={tailwind`text-base font-semibold`}>{profile.email}</Text>
        </View>

        {/* Edit Password */}

        {/* Edit Phone */}
        <View
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Phone:</Text>
          <Text style={tailwind`text-base font-semibold`}>
            {profile.About[0].phone}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setActiveModal('password')}
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Edit Password</Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
        {profile.tier === 3 && (
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
              {backgroundColor: themeColors.darkSecondary},
            ]}>
            <Text style={tailwind`text-base font-semibold`}>Pro+ Settings</Text>
            <ChevronsRight height={24} width={24} color={themeColors.primary} />
          </TouchableOpacity>
        )}

        {/* Privacy Section */}
        <Text style={tailwind`text-xl font-semibold text-gray-500 mt-3`}>
          Privacy:
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('BlockedUsers')}
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Blocked Users</Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>

        {/* Billing Section */}
        <Text style={tailwind`text-xl font-semibold text-gray-500 my-3`}>
          Billing & Plans:
        </Text>
        <TouchableOpacity
          onPress={() => setActiveModal('billing')}
          style={[
            tailwind`flex-row justify-between items-center p-4 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Billing</Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveModal('pastTransactions')}
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>
            Past Transactions
          </Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => setActiveModal('restore')}
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>
            Restore Purchase
          </Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity> */}

        {/* Help & Support */}
        <Text style={tailwind`text-xl font-semibold text-gray-500 my-3`}>
          Help & Support:
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('FAQ')}
          style={[
            tailwind`flex-row justify-between items-center p-4 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>FAQ's</Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ContactUs')}
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Contact Us</Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ReportBug')}
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Report A Bug</Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>

        {/* Legal Documents (External Links) */}
        <TouchableOpacity
          onPress={() =>
            openLink(
              'https://app.termly.io/policy-viewer/policy.html?policyUUID=6c415447-ebe1-4647-9104-e89d1c3879c8',
            )
          }
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>
            Terms of Service
          </Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            openLink(
              'https://app.termly.io/policy-viewer/policy.html?policyUUID=36e1fc4b-c6f8-47a7-b03f-8fd1e1144c89',
            )
          }
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>Privacy Policy</Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            openLink(
              'https://app.termly.io/policy-viewer/policy.html?policyUUID=2c96703e-b201-4b10-8414-c9a70374f352',
            )
          }
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
          ]}>
          <Text style={tailwind`text-base font-semibold`}>
            End User License Agreement (EULA)
          </Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>

        {/* Footer */}

        {/* Modal Rendering */}
        <Modal
          visible={!!activeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveModal(null)}>
          <View
            style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-40`}>
            <View
              style={[
                tailwind`w-11/12 p-5 rounded-xl`,
                {backgroundColor: themeColors.secondary},
              ]}>
              {activeModal === 'billing' && (
                <BillingModalContent setActiveModal={setActiveModal} />
              )}
              {activeModal === 'pastTransactions' && (
                <PastTransactionsModalContent setActiveModal={setActiveModal} />
              )}
              {activeModal === 'restore' && (
                <RestorePurchaseModalContent
                  onRestore={() => {
                    Alert.alert(
                      'Restored',
                      'Your purchases have been restored.',
                    );
                    setActiveModal(null);
                  }}
                  setActiveModal={setActiveModal}
                />
              )}
              {activeModal === 'verify' && (
                <VerifyModalContent
                  email={email}
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                  setActiveModal={setActiveModal}
                />
              )}
              {activeModal === 'email' && (
                <EmailModalContent
                  email={email}
                  setEmail={setEmail}
                  setActiveModal={setActiveModal}
                />
              )}
              {activeModal === 'password' && (
                <PasswordModalContent
                  password={password}
                  setPassword={setPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  verifyPassword={verifyPassword}
                  setVerifyPassword={setVerifyPassword}
                  setActiveModal={setActiveModal}
                  updatePasswordViaServer={updatePasswordViaServer}
                />
              )}
              {activeModal === 'phone' && (
                <PhoneModalContent
                  phone={phone}
                  setPhone={setPhone}
                  setActiveModal={setActiveModal}
                />
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default SubSettingsScreen;
