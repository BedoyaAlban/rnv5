import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SettingsScreen</Text>
      <Button title="Click here" onPress={() => alert('Button Clicked!')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingsScreen;
