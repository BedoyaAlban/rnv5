import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SplashScreen = ({navigation}) => {
  /*var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch(
    'https://europe-west3-socialapplor.cloudfunctions.net/api/screams',
    requestOptions,
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));*/

  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duration={1500}
          source={require('../assets/lor-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <Text
          style={[
            styles.title,
            {
              color: '#95864D',
            },
          ]}>
          Stay connected with everyone!
        </Text>
        <Text style={styles.text}>Sign in with account</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
            <LinearGradient
              colors={['#79767A', '#28242A']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Get Started</Text>
              <MaterialIcons name="navigate-next" color="#95864D" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SplashScreen;

const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28242A',
  },
  title: {
    color: '#98864D',
    fontSize: 30,
    fontWeight: 'bold',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  text: {
    color: 'grey',
    marginTop: 5,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: '#95864D',
    fontWeight: 'bold',
  },
});
