import axios from 'axios';
import React from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';

const EditProfileScreen = ({route}) => {
  // Data transmitted via the stack navigator
  const {bio} = route.params;
  const {location} = route.params;
  const {website} = route.params;
  // Data by default
  const [data, setData] = React.useState({
    bio: bio,
    location: location,
    website: website,
  });
  // Func to change content of the bio text input
  const bioInputChange = val => {
    setData({
      ...data,
      bio: val,
    });
  };
  // Func to change content of the location text input
  const locationInputChange = val => {
    setData({
      ...data,
      location: val,
    });
  };
  // Func to change content of the website text input
  const websiteInputChange = val => {
    setData({
      ...data,
      website: val,
    });
  };
  // Func to send to the database the data edited
  const editUserDetails = (bioData, locationData, websiteData) => {
    const userDetails = {
      bio: bioData,
      location: locationData,
      website: websiteData,
    };
    axios
      .post(
        'https://europe-west3-socialapplor.cloudfunctions.net/api/user',
        userDetails,
      )
      .then(() => {
        Alert.alert('Your details have been edited successfully!');
      })
      .catch(e => {
        console.log(e);
        Alert.alert('Something went wrong!', [{text: 'Ok'}]);
      });
  };

  const {colors} = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}>
      <Text style={styles.textTitle}>Edit Profile</Text>
      <View style={styles.actionBio}>
        <Text style={styles.text}>Bio :</Text>
        <View style={styles.bio}>
          <TextInput
            defaultValue={bio}
            multiline
            maxLength={500}
            numberOfLines={4}
            style={[styles.textInput, {color: colors.text}]}
            onChangeText={val => bioInputChange(val)}
          />
        </View>
      </View>
      <View style={styles.action}>
        <Text style={styles.text}>Location :</Text>
        <TextInput
          defaultValue={location}
          style={[styles.textInput, {color: colors.text}]}
          onChangeText={val => locationInputChange(val)}
        />
      </View>
      <View style={styles.action}>
        <Text style={styles.text}>Website :</Text>
        <TextInput
          defaultValue={website}
          style={[styles.textInput, {color: colors.text}]}
          onChangeText={val => websiteInputChange(val)}
        />
      </View>
      <View style={styles.button}>
        <TouchableOpacity
          style={styles.edit}
          onPress={() => {
            editUserDetails(data.bio, data.location, data.website);
          }}>
          <LinearGradient colors={['#79767A', '#28242A']} style={styles.edit}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#98864D',
                },
              ]}>
              Edit
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#95864D',
    marginBottom: 40,
  },
  bio: {
    marginLeft: 2,
    height: 150,
    width: 320,
  },
  actionBio: {
    width: 350,
    height: 150,
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  action: {
    width: 350,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
  },
  text: {
    color: '#95864D',
  },
  dark: {
    color: 'black',
  },
  light: {
    color: '#fff',
  },
  edit: {
    width: 400,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
});

export default EditProfileScreen;
