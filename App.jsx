import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import Routes from './src/Routes/routes';
import store from './src/services/store';

const App = () => {
  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#1A3F1E"
          translucent={false}
        />
        <Routes />
      </View>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
