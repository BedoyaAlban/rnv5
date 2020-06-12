import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const SupportScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SupportScreen</Text>
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

export default SupportScreen;
