import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TermCondition = ({navigation}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const termsData = [
    {
      question: 'What does lorem mean?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi udolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ',
    },
    {
      question: 'Where can I subscribe to your newsletter for amazing news ?',
      answer:
        'You can subscribe to our newsletter by visiting our website and entering your email in the subscription box.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer:
        "To cancel your subscription, go to your account settings and click on 'Cancel Subscription'.",
    },
    {
      question: 'Is my data safe with you?',
      answer:
        'Yes, we use encryption and security best practices to keep your data safe.',
    },
  ];

  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderItem = ({item, index}) => (
    <View style={[styles.item, expandedIndex === index && styles.expandedItem]}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={() => toggleExpand(index)}>
        <Text style={styles.questionText}>{item.question}</Text>
        <Text style={styles.arrow}>{expandedIndex === index ? '−' : '+'}</Text>
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
      <Text style={styles.header}>Terms And Condition</Text>
      <FlatList
        data={termsData}
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a3c20',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 10,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16, // More padding for better spacing
    borderWidth: 0.6,
    borderColor: '#E0E0E0',

    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  expandedItem: {
    backgroundColor: '#fff',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A3F1E',
    flexWrap: 'wrap',
    width: 280,
  },
  arrow: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1A3F1E',
    width: 25,
    height: 25,
    display: 'flex', // Ensure Flexbox is applied
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    textAlign: 'center', // Center text (needed for <Text> elements)
    borderRadius: 12.5, // Make it a circle (optional)
  },

  answerText: {
    fontSize: 14,
    marginTop: 10,
    color: '##000000',
    lineHeight: 21,
    letterSpacing: -0.28,
  },
});

export default TermCondition;
