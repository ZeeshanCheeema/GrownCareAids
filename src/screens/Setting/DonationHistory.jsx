import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useMyDonationHistoryQuery} from '../../services/Auth/AuthApi';

const DonationHistoryScreen = ({navigation}) => {
  const [expandedId, setExpandedId] = useState(null);
  const {data, error, isLoading} = useMyDonationHistoryQuery(); // Fetch donation history

  const toggleExpand = id => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1a3c20" />
      </View>
    );
  }
  console.log(data);
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#1a3c20" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Donation History</Text>
      </View>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={'#858585'}
        />
        <TouchableOpacity>
          <Icon name="filter-list" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Donation List */}
      <FlatList
        data={data?.data || []}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            {/* Card Header */}
            <TouchableOpacity onPress={() => toggleExpand(item._id)}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              {item.description && expandedId === item._id && (
                <Text style={styles.description}>{item.description}</Text>
              )}

              {/* Fundraising Info */}
              <View style={styles.row}>
                <Text>Amount Target: ${item.targetAmount}</Text>
                <Text>Fundraised: ${item.fundraised}</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${(item.fundraised / item.targetAmount) * 100}%`},
                  ]}
                />
              </View>

              {/* More Info when expanded */}
              {expandedId === item._id && (
                <View>
                  <View style={styles.row}>
                    <Text>Duration</Text>
                    <Text>Location</Text>
                  </View>
                  <View style={styles.row}>
                    <Text>{item.date}</Text>
                    <Text>{item.location}</Text>
                  </View>

                  {item.payment && (
                    <>
                      <View style={styles.row}>
                        <Text>Debit Card</Text>
                        <Text>Amount</Text>
                      </View>
                      <View style={styles.row}>
                        <Text>**** **** **** {item.payment.cardLast4}</Text>
                        <Text>${item.payment.amount}</Text>
                      </View>

                      <View style={styles.row}>
                        <Text>Day / Date</Text>
                        <Text>Time</Text>
                      </View>
                      <View style={styles.row}>
                        <Text>{item.payment.date}</Text>
                        <Text>{item.payment.time}</Text>
                      </View>
                    </>
                  )}
                </View>
              )}
            </TouchableOpacity>

            {/* Expand/Collapse Icon */}
            <TouchableOpacity
              onPress={() => toggleExpand(item._id)}
              style={styles.expandIcon}>
              <Icon
                name={
                  expandedId === item._id
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a3c20',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: 'black',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginVertical: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a3c20',
    borderRadius: 5,
  },
  expandIcon: {
    alignSelf: 'center',
    marginTop: 5,
  },
});

export default DonationHistoryScreen;
