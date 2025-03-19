import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import color from '../../utils/color';

const FAQ = ({navigation}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqData = [
    {
      question: 'How can I run a campaign?',
      answer:
        "To run a campaign, sign up on our platform, complete your profile, and click on 'Start a Campaign'. Follow the guided steps to set up your fundraiser.",
    },
    {
      question:
        'Are the funds raised through CrowdCareAid subject to tax implications?',
      answer:
        'Tax implications vary based on your country’s laws. We recommend consulting a tax advisor for precise information.',
    },
    {
      question: 'How can I add a bank account to withdraw funds?',
      answer:
        "Go to 'Settings' > 'Payment Methods' and add your bank details. You may need to verify your identity before withdrawal.",
    },
    {
      question: 'How do I get in touch with CrowdCareAid?',
      answer:
        'You can contact us through our support page, email us at support@crowdcareaid.com, or call our helpline.',
    },
    {
      question: 'How do I know if the money I donated reaches the beneficiary?',
      answer:
        "We provide real-time updates, receipts, and reports for all donations. You can track your contributions in the 'Donations' section.",
    },
    {
      question: 'Can I make my donation anonymous?',
      answer:
        "Yes, you can choose to donate anonymously by selecting the 'Anonymous Donation' option during the payment process.",
    },
  ];

  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderItem = ({item, index}) => (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={() => toggleExpand(index)}>
        <Text style={styles.questionText}>{item.question}</Text>
        <Text style={styles.arrow}>{expandedIndex === index ? '˄' : '˅'}</Text>
      </TouchableOpacity>
      {expandedIndex === index && (
        <Text style={styles.answerText}>{item.answer}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={25} color="#1a3c20" />
      </TouchableOpacity>
      <Text style={styles.header}>FAQ</Text>
      <FlatList
        data={faqData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: color.background,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  faqItem: {
    backgroundColor: color.secondary,
    borderRadius: 25,
    marginBottom: 10,
    padding: 15,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 10,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    color: color.white,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  arrow: {
    color: color.white,
    fontSize: 18,
  },
  answerText: {
    color: color.secondary,
    backgroundColor: color.white,
    fontSize: 14,
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    lineHeight: 21,
  },
});

export default FAQ;
