import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {MARK_NOTIFICATIONS_READ, SET_UNAUTHENTICATED, SET_USER} from '../types';

export const loginUser = userData => dispatch => {
  axios
    .post(
      'https://europe-west3-socialapplor.cloudfunctions.net/api/login',
      userData,
    )
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
};

export const signupUser = newUserData => dispatch => {
  axios
    .post(
      'https://europe-west3-socialapplor.cloudfunctions.net/api/signup',
      newUserData,
    )
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
};

export const logoutUser = () => async dispatch => {
  try {
    await AsyncStorage.removeItem('FBIdToken');
  } catch (e) {
    console.log(e);
  }
  delete axios.defaults.headers.common['Authorization'];
  dispatch({type: SET_UNAUTHENTICATED});
};

export const getUserData = () => dispatch => {
  axios
    .get('https://europe-west3-socialapplor.cloudfunctions.net/api/user')
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
};

export const uploadImage = FormData => dispatch => {
  axios
    .post(
      'https://europe-west3-socialapplor.cloudfunctions.net/api/user/image',
      FormData,
    )
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
};

export const editUserDetails = userDetails => dispatch => {
  axios
    .post(
      'https://europe-west3-socialapplor.cloudfunctions.net/api/user',
      userDetails,
    )
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
};

export const markNotificationsRead = notificationIds => dispatch => {
  axios
    .post(
      'https://europe-west3-socialapplor.cloudfunctions.net/api/notifications',
      notificationIds,
    )
    .then(res => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ,
      });
    })
    .catch(err => console.log(err));
};

const setAuthorizationHeader = async token => {
  const FBIToken = `Bearer ${token}`;
  try {
    await AsyncStorage.setItem('FBIToken', FBIToken);
  } catch (e) {
    console.log(e);
  }
  axios.defaults.headers.common['Authorization'] = FBIToken;
};
