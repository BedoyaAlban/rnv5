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
import FonteAwesome from 'react-native-vector-icons/FontAwesome';

const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    check_textInputChange: false,
    check_textInputUserChange: false,
    isValidEmail: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
    isValidUserName: true,
    secureTextEntry: true,
    confirmSecureTextEntry: true,
  });
  // REGEX pour email
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // Func change content email text input
  const emailInputChange = val => {
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
  // Func check if email is valid
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
  // Func change content username text input
  const userNameInputChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputUserChange: true,
        isValidUserName: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputUserChange: false,
        isValidUserName: false,
      });
    }
  };
  // Func change content password text input
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
  // Func change content confirm password text input
  const ConfirmPasswordInputChange = val => {
    if (val.trim() === data.password) {
      setData({
        ...data,
        confirmPassword: val,
        check_textInputChange: true,
        isValidConfirmPassword: true,
      });
    } else {
      setData({
        ...data,
        confirmPassword: val,
        check_textInputChange: false,
        isValidConfirmPassword: false,
      });
    }
  };
  // Func check if password === confirmpassword
  const handleConfirmPasswordValid = val => {
    if (val.trim() === data.password) {
      setData({
        ...data,
        isValidConfirmPassword: true,
      });
    } else {
      setData({
        ...data,
        isValidConfirmPassword: false,
      });
    }
  };
  // Func to set visible or not password
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  // Func to set visible or not the confirm password
  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirmSecureTextEntry: !data.confirmSecureTextEntry,
    });
  };
  const {colors} = useTheme();
  // Func to send the data of the new user to the DB
  const registerUser = (
    emailData,
    passwordData,
    confirmPasswordData,
    userNameData,
  ) => {
    const userData = {
      email: emailData,
      password: passwordData,
      confirmPassword: confirmPasswordData,
      handle: userNameData,
    };
    axios
      .post(
        'https://europe-west3-socialapplor.cloudfunctions.net/api/signup',
        userData,
      )
      .then(res => {
        Alert.alert('Your registration is successful, you can now Sign In');
      })
      .catch(e => {
        console.log(e);
        Alert.alert('Invalid Credentials', 'You must respect instructions!', [
          {text: 'Ok'},
        ]);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#28242A" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <FonteAwesome name="at" color="#95864D" size={20} />
          <TextInput
            placeholder="Your Email"
            placeholderTextColor={colors.text}
            style={[styles.textInput, {color: colors.text}]}
            autoCapitalize="none"
            onChangeText={val => emailInputChange(val)}
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
        <Text style={[styles.text_footer, {marginTop: 35}]}>Password</Text>
        <View style={styles.action}>
          <Feather name="lock" color="#95864D" size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor={colors.text}
            style={[styles.textInput, {color: colors.text}]}
            secureTextEntry={data.secureTextEntry ? true : false}
            autoCapitalize="none"
            onChangeText={val => handlePasswordChange(val)}
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
              For your security Password must be 8 characters long and contain
              min/maj.
            </Text>
          </Animatable.View>
        )}
        <Text style={[styles.text_footer, {marginTop: 35}]}>
          Confirm Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color="#95864D" size={20} />
          <TextInput
            placeholder="Confirm Your Password"
            placeholderTextColor={colors.text}
            style={[styles.textInput, {color: colors.text}]}
            secureTextEntry={data.confirmSecureTextEntry ? true : false}
            autoCapitalize="none"
            onChangeText={val => ConfirmPasswordInputChange(val)}
            onEndEditing={e => handleConfirmPasswordValid(e.nativeEvent.text)}
          />
          <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
            {data.confirmSecureTextEntry ? (
              <Feather name="eye-off" color={colors.text} size={20} />
            ) : (
              <Feather name="eye" color={colors.text} size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidConfirmPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              The confirmation of your password is incorrect!
            </Text>
          </Animatable.View>
        )}
        <Text style={[styles.text_footer, {marginTop: 35}]}>Username</Text>
        <View style={styles.action}>
          <FonteAwesome name="user-o" color="#95864D" size={20} />
          <TextInput
            placeholder="Your Username"
            placeholderTextColor={colors.text}
            style={[styles.textInput, {color: colors.text}]}
            autoCapitalize="none"
            onChangeText={val => userNameInputChange(val)}
          />
          {data.check_textInputUserChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidUserName ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Username must be 4 characters long!
            </Text>
          </Animatable.View>
        )}
        <View style={styles.button}>
          <TouchableOpacity
            style={
              data.email.length == 0 ||
              data.password.length.length == 0 ||
              data.confirmPassword.length == 0 ||
              data.username.length == 0
                ? styles.signUpValid
                : styles.signUp
            }
            onPress={() => {
              registerUser(
                data.email,
                data.password,
                data.confirmPassword,
                data.username,
              );
            }}>
            <LinearGradient
              colors={['#79767A', '#28242A']}
              style={styles.signUp}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#98864D',
                  },
                ]}>
                Sign Up
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignInScreen')}
            style={[
              styles.signUp,
              {
                borderColor: '#95864D',
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
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

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
    color: '#95864D',
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
  signUp: {
    width: 400,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signUpValid: {
    display: 'none',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMsg: {
    color: 'red',
  },
  valid: {
    color: 'green',
  },
});

export default SignInScreen;
