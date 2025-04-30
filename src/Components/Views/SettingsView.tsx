import React, { useState } from 'react';
import {Alert, Modal, Text, TextInput, Touchable, TouchableOpacity, View} from 'react-native';
import {Check, ChevronsDown, ChevronsLeft, ChevronsRight} from 'react-native-feather';
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
interface SettingsViewProps {
  updateTab: (tab: string) => void;
}

const SettingsView = ({updateTab}: SettingsViewProps) => {

    const [activeModal, setActiveModal] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
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
      <View
        style={tailwind`w-full flex flex-col mb-3`}>
        <Text style={tailwind`text-xl font-semibold text-gray-500`}>
          Account:
        </Text>
      </View>
      <View style={[tailwind`w-full flex flex-col rounded-2`,
            {backgroundColor: themeColors.darkSecondary},
            ]}>
        <TouchableOpacity
            onPress={() => {
                setActiveModal('email');
            }}
            style={
            tailwind`flex-row justify-between items-center p-4`}>
            <Text style={tailwind`text-base font-semibold text-gray-800`}>
            Edit Email
            </Text>
            <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
      </View>
      <View style={[tailwind`w-full flex flex-col rounded-2 mt-2`,
            {backgroundColor: themeColors.darkSecondary},
            ]}>
        <TouchableOpacity
            onPress={() => {
                setActiveModal('password');
            }}
            style={
            tailwind`flex-row justify-between items-center p-4`}>
            <Text style={tailwind`text-base font-semibold text-gray-800`}>
            Edit Password
            </Text>
            <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
      </View>
      <View style={[tailwind`w-full flex flex-col rounded-2 mt-2`,
            {backgroundColor: themeColors.darkSecondary},
            ]}>
        <TouchableOpacity
            onPress={() => {
                setActiveModal('phone');
            }}
            style={
            tailwind`flex-row justify-between items-center p-4`}>
            <Text style={tailwind`text-base font-semibold text-gray-800`}>
            Edit Phone
            </Text>
            <ChevronsRight height={24} width={24} color={themeColors.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
            setActiveModal('verify');
        }}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Verify Email
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <View style={tailwind`w-full flex flex-row my-3`}>
        <Text style={tailwind`text-xl font-semibold text-gray-500`}>
          Privacy:
        </Text>
      </View>
      <View
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Block Users
        </Text>
        <Check height={24} width={24} color={themeColors.primary} />
      </View>
      <View style={tailwind`w-full flex flex-row my-3`}>
        <Text style={tailwind`text-xl font-semibold text-gray-500`}>
          Billing & Plans:
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
            setActiveModal('billing');
        }}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Billing
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
            setActiveModal('pastTransactions');
        }}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Past Transactions
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
            setActiveModal('restore');
        }}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Restore Purchase
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>

      <View style={tailwind`w-full flex flex-row my-3`}>
        <Text style={tailwind`text-xl font-semibold text-gray-500`}>
          Help & Support:
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => updateTab('faq')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          FAQ's
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateTab('contact')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Contact Us
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateTab('bug')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Report A Bug
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={
            () => updateTab('terms')
        }
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Terms Of Use
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateTab('privacy')}
        style={[
          tailwind`flex-row justify-between items-center p-4 rounded-2 mt-2`,
          {backgroundColor: themeColors.darkSecondary},
        ]}>
        <Text style={tailwind`text-base font-semibold text-gray-800`}>
          Privacy Policy
        </Text>
        <ChevronsRight height={24} width={24} color={themeColors.primary} />
      </TouchableOpacity>
      <View style={tailwind`w-full flex flex-row justify-center mt-3`}>
        <Text style={tailwind`text-sm font-semibold text-gray-500`}>
          Marhabah Inc. © 2025 All Rights Reserved.
        </Text>
      </View>
      <View style={tailwind`w-full flex flex-row justify-center mb-3`}>
        <Text style={tailwind`text-sm font-semibold text-gray-500`}>
          V. 1.0.1 (May 12, 2025)
        </Text>
      </View>
      <Modal
  visible={!!activeModal}
  transparent
  animationType="fade"
  onRequestClose={() => setActiveModal(null)}
>
  <View style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-40`}>
    <View style={[tailwind`w-11/12 p-5 rounded-xl`, { backgroundColor: themeColors.secondary }]}>
        {activeModal === 'billing' && <BillingModalContent setActiveModal={setActiveModal} />}
        {activeModal === 'pastTransactions' && <PastTransactionsModalContent setActiveModal={setActiveModal} />}
        {activeModal === 'restore' && (
        <RestorePurchaseModalContent onRestore={() => {
            // Add restore purchase logic here
            Alert.alert('Restored', 'Your purchases have been restored.');
            setActiveModal(null);
        }} setActiveModal={setActiveModal}/>
        )}
        {activeModal === 'verify' && (
        <VerifyModalContent email={email} verificationCode={verificationCode} setVerificationCode={setVerificationCode} setActiveModal={setActiveModal} />
        )}
        {activeModal === 'email' && (
        <EmailModalContent email={email} setEmail={setEmail} setActiveModal={setActiveModal} />
        )}
        {activeModal === 'password' && (
        <PasswordModalContent password={password} setPassword={setPassword} newPassword={newPassword} setNewPassword={setNewPassword} verifyPassword={verifyPassword} setVerifyPassword={setVerifyPassword} setActiveModal={setActiveModal} />
        )}
        {activeModal === 'phone' && (
        <PhoneModalContent phone={phone} setPhone={setPhone} setActiveModal={setActiveModal} />
        )}
    </View>
  </View>
</Modal>

    </View>
  );
};

export default SettingsView;
