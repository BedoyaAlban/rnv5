import AsyncStorage from '@react-native-community/async-storage';
import {useTheme} from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
import {Alert, Text, TextInput, TouchableHighlight, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';

const AddScreamScreen = () => {
  const [newScream, setNewScream] = React.useState({
    body: 'Scream at your fellow apes!',
    isValidScream: true,
  });
  const [feedUT, setFeedUT] = React.useState();
  // Func to retrieve the token in the storage
  const getUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setFeedUT(token);
    } catch (e) {
      console.log(e);
    }
  };
  // Change content of the new scream text input
  const newScreamInputChange = val => {
    if (val.trim().length > 0) {
      setNewScream({
        ...newScream,
        body: val,
      });
    } else {
      setNewScream({
        ...newScream,
        isValidScream: false,
      });
    }
  };
  // Func to send the new scream to the DB
  const PostScream = newScream => {
    const FBIToken = `Bearer ${feedUT}`;
    axios.defaults.headers.common['Authorization'] = FBIToken;
    axios
      .post(
        'https://europe-west3-socialapplor.cloudfunctions.net/api/scream',
        newScream,
      )
      .then(res => {
        Alert.alert('Scream posted!');
      });
  };

  const {colors} = useTheme();

  React.useEffect(() => {
    getUserToken();
  });

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#95864D',
          paddingBottom: 20,
        }}>
        Post a new scream
      </Text>
      <View
        style={{backgroundColor: '#28242A', alignItems: 'center', width: 350}}>
        <TextInput
          onChangeText={val => newScreamInputChange(val)}
          style={{
            width: 200,
            height: 150,
            color: colors.background,
            textAlign: 'center',
            borderBottomWidth: 1,
            borderBottomColor: colors.background,
          }}
          defaultValue={newScream.body}
          multiline
          numberOfLines={6}
          maxLength={140}
        />
        {newScream.isValidScream ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={{color: 'red'}}>Scream cannot be empty!</Text>
          </Animatable.View>
        )}
        <TouchableHighlight
          onPress={() => PostScream(newScream)}
          style={{
            backgroundColor: '#936851',
            borderRadius: 50,
            width: 40,
            height: 40,
            marginBottom: 10,
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Icon
            name="ios-paper-plane"
            size={30}
            color={colors.background}
            style={{paddingTop: 4, paddingRight: 3}}
          />
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default AddScreamScreen;
