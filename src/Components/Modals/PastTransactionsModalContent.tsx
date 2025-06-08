import React from 'react';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import tailwind from 'twrnc';
import {useProfile} from '../../Context/ProfileContext';

const PastTransactionsModalContent = ({setActiveModal}) => {
  const {profile} = useProfile();

  // Defensive fallback in case subscriptions is undefined or empty
  const subscriptions = profile?.subscriptions || [];

  // Sort subscriptions newest first (based on created_at)
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <View style={tailwind`max-h-[80%]`}>
      <Text style={tailwind`text-lg font-semibold text-center mb-3`}>
        Past Transactions
      </Text>

      {sortedSubscriptions.length === 0 ? (
        <Text style={tailwind`text-sm text-gray-700 mb-2 text-center`}>
          No past transactions found.
        </Text>
      ) : (
        <ScrollView style={tailwind`mb-4`}>
          {sortedSubscriptions.map((sub, index) => {
            // Format dates for display
            const purchaseDate = sub.purchase_date
              ? new Date(sub.purchase_date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Unknown date';

            const productLabel =
              sub.product_id === 'marhabah_pro_499'
                ? 'Marhabah Pro'
                : sub.product_id === 'marhabah_pro_plus_899'
                ? 'Marhabah Pro+'
                : sub.product_id || 'Unknown Product';

            // NOTE: Apple doesn't provide price in receipt, you may map price manually if you want:
            const priceMapping = {
              marhabah_pro_499: '$4.99',
              marhabah_pro_plus_899: '$8.99',
            };

            const price = priceMapping[sub.product_id] || '—';

            return (
              <Text
                key={sub.id || index}
                style={tailwind`text-sm text-gray-700 mb-2`}>
                • {purchaseDate} – {price} – {productLabel}
              </Text>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => setActiveModal(null)}
        style={tailwind`mt-2 py-3 rounded-xl`}>
        <Text style={tailwind`text-red-500 text-center text-base`}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PastTransactionsModalContent;
