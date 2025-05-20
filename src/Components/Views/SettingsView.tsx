import React, {useState} from 'react';
import {
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {Check, ChevronsLeft, ChevronsRight} from 'react-native-feather';
import tailwind from 'twrnc';
import themeColors from '../../Utils/custonColors';
import {
  clearJwtToken,
  clearProfile,
  clearSession,
  clearUserId,
} from '../../Services/AuthStoreage';
import RestorePurchaseModalContent from '../Modals/RestorePurchaseModalContent';
import BillingModalContent from '../Modals/BillingModalContent';
import PastTransactionsModalContent from '../Modals/PastTransactionsModalContent';
import VerifyModalContent from '../Modals/VerifyModalContent';
import PhoneModalContent from '../Modals/PhoneModalContent';
import PasswordModalContent from '../Modals/PasswordModalContent';
import EmailModalContent from '../Modals/EmailModalContent';
import {useProfile} from '../../Context/ProfileContext';
import axios from 'axios';

interface SettingsViewProps {
  updateTab: (tab: string) => void;
}

const SettingsView = ({updateTab}: SettingsViewProps) => {
  const {profile} = useProfile();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const openLink = (url: string) => Linking.openURL(url);

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

  return (
    <View style={tailwind`flex-1`}>
      <TouchableOpacity
        onPress={() => updateTab('profile')}
        style={tailwind`w-full flex flex-row items-center mb-3 mt-2`}>
        <ChevronsLeft height={30} width={30} color={themeColors.primary} />
        <Text
          style={[
            tailwind`text-2xl font-semibold`,
            {color: themeColors.primary},
          ]}>
          Settings
        </Text>
      </TouchableOpacity>

      {/* Account Section */}
      <Text style={tailwind`text-xl font-semibold text-gray-500 my-3`}>
        Account:
      </Text>

      {/* Edit Email */}
      <View
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>Email:</Text>
        <Text style={tailwind`text-base font-semibold text-white`}>
          {profile.email}
        </Text>
      </View>

      {/* Edit Password */}

      {/* Edit Phone */}
      <View
        style={[
          tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>Phone:</Text>
        <Text style={tailwind`text-base font-semibold text-white`}>
          {profile.About[0].phone}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setActiveModal('password')}
        style={[
          tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Edit Password
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      {profile.tier === 3 && (
        <TouchableOpacity
          onPress={() => updateTab('proSettings')}
          style={[
            tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
            {backgroundColor: themeColors.darkGrey},
          ]}>
          <Text style={tailwind`text-base font-semibold text-white`}>
            Pro+ Settings
          </Text>
          <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
      )}

      {/* Privacy Section */}
      <Text style={tailwind`text-xl font-semibold text-gray-500 mt-3`}>
        Privacy:
      </Text>
      <TouchableOpacity
        onPress={() => updateTab('blockedUsers')}
        style={[
          tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Blocked Users
        </Text>
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
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Billing
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveModal('pastTransactions')}
        style={[
          tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Past Transactions
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveModal('restore')}
        style={[
          tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Restore Purchase
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>

      {/* Help & Support */}
      <Text style={tailwind`text-xl font-semibold text-gray-500 my-3`}>
        Help & Support:
      </Text>
      <TouchableOpacity
        onPress={() => updateTab('faq')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>FAQ's</Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateTab('contact')}
        style={[
          tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Contact Us
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateTab('bug')}
        style={[
          tailwind`flex-row justify-between items-center p-4 mt-2 rounded-2`,
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Report A Bug
        </Text>
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
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
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
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
          Privacy Policy
        </Text>
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
          {backgroundColor: themeColors.darkGrey},
        ]}>
        <Text style={tailwind`text-base font-semibold text-white`}>
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
                  Alert.alert('Restored', 'Your purchases have been restored.');
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
    </View>
  );
};

export default SettingsView;
