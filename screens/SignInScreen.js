import axios from 'axios';
import React from 'react';
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../components/context';

const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    email: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidEmail: true,
    isValidPassword: true,
  });

  const {colors} = useTheme();
  const {signIn} = React.useContext(AuthContext);
  // REGEX pour mail
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // Func to verify if the email match with the regex and change content of email text input
  const textInputChange = val => {
    if (val.match(mailFormat)) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
        isValidEmail: false,
      });
    }
  };
  // Func to change content of the password text input
  const handlePasswordChange = val => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };
  // Func to set visible or not the password
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  // Func to check if the email is Valid
  const handleValidEmail = val => {
    if (val.match(mailFormat)) {
      setData({
        ...data,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        isValidEmail: false,
      });
    }
  };
  // Func to check if the password is long enough
  const handleValidPassword = val => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        isValidPassword: false,
      });
    }
  };
  // Func to send the data to the database with in response a token if tha data exist in the DB
  const loginHandle = (emailData, passwordData) => {
    /*const foundUser = Users.filter(item => {
      return email == item.email && password == item.password;
    });*/
    const userData = {
      email: emailData,
      password: passwordData,
    };
    axios
      .post(
        'https://europe-west3-socialapplor.cloudfunctions.net/api/login',
        userData,
      )
      .then(res => {
        const token = res.data.token;
        signIn(token);
      })
      .catch(e => {
        console.log(e);
        Alert.alert('Invalid Email!', 'Email or Password is incorrect!', [
          {text: 'Ok'},
        ]);
      });

    if (data.email.length == 0 || data.password.length == 0) {
      Alert.alert('Wrong Input!', 'Email or Password field cannot be empty.', [
        {text: 'Ok'},
      ]);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
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
            styles.text_footer,
            {
              color: '#95864D',
            },
          ]}>
          Email
        </Text>
        <View style={styles.action}>
          <FontAwesome name="at" color="#95864D" size={20} />
          <TextInput
            placeholder="Your Email"
            placeholderTextColor={colors.text}
            style={[styles.textInput, {color: colors.text}]}
            autoCapitalize="none"
            onChangeText={val => textInputChange(val)}
            onEndEditing={e => handleValidEmail(e.nativeEvent.text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidEmail ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Please enter a valid email adress!
            </Text>
          </Animatable.View>
        )}

        <Text
          style={[
            styles.text_footer,
            {
              color: '#95864D',
              marginTop: 35,
            },
          ]}>
          Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color="#95864D" size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor={colors.text}
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[styles.textInput, {color: colors.text}]}
            autoCapitalize="none"
            onChangeText={val => handlePasswordChange(val)}
            onEndEditing={e => handleValidPassword(e.nativeEvent.text)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color={colors.text} size={20} />
            ) : (
              <Feather name="eye" color={colors.text} size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 8 characters long.
            </Text>
          </Animatable.View>
        )}

        <TouchableOpacity>
          <Text style={{color: '#644931', marginTop: 15}}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity
            style={
              data.email.length == 0 || data.password.length == 0
                ? styles.signInValid
                : styles.signIn
            }
            onPress={() => {
              loginHandle(data.email, data.password);
              //loginUser(userData);
            }}>
            <LinearGradient
              colors={['#79767A', '#28242A']}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#98864D',
                  },
                ]}>
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUpScreen')}
            style={[
              styles.signIn,
              {
                borderColor: '#98864D',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: colors.text,
                },
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28242A',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#98864D',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
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
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: 400,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMsg: {
    color: 'red',
  },
  signInValid: {
    display: 'none',
  },
});
