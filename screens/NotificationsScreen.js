import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Avatar, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../components/context';

const NotificationsScreen = ({navigation}) => {
  const [userNotifications, setUserNotifications] = useState();
  const [scream, setScream] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [userToken, setUserToken] = React.useState();
  const theme = useTheme();
  const {colors} = useTheme();

  dayjs.extend(relativeTime);

  // Get user notifications retrieving the token
  const getUserNotifications = async () => {
    try {
      const feedUT = await AsyncStorage.getItem('userToken');
      setUserToken(feedUT);
      const FBIToken = `Bearer ${feedUT}`;
      axios.defaults.headers.common['Authorization'] = FBIToken;

      axios
        .get('https://europe-west3-socialapplor.cloudfunctions.net/api/user')
        .then(res => {
          const data = res.data;
          setUserNotifications(data.notifications);
        });
    } catch (e) {
      console.log(e);
    }
  };

  // Get the scream
  const getScreamNotificationed = screamId => {
    axios
      .get(
        `https://europe-west3-socialapplor.cloudfunctions.net/api/scream/${screamId}`,
      )
      .then(res => {
        const data = res.data;
        setScream(data);
      });
  };

  // Post the notifications reads
  const notificationMarkedRead = idNotif => {
    let unreadNotificationsIds = userNotifications
      .filter(not => idNotif)
      .map(not => not.notificationId);

    axios.post(
      'https://europe-west3-socialapplor.cloudfunctions.net/api/notifications',
      unreadNotificationsIds,
    );
  };

  // When the element is loaded call the function
  useEffect(() => {
    getUserNotifications();
  }, []);

  const {signOut} = React.useContext(AuthContext);

  // Logout the user if the token has expired
  if (userToken) {
    const decodedToken = jwtDecode(userToken);
    if (decodedToken.exp * 1000 < Date.now()) {
      signOut();
    }
  }

  // View containing the details of the notification
  const Item = ({
    createdAt,
    sender,
    type,
    read,
    onSelect,
    idScream,
    idNotif,
  }) => {
    return (
      <View
        style={!theme.dark && read ? styles.lightTheme : styles.itemContainer}>
        <Icon
          name={type == 'like' ? 'ios-heart' : 'ios-filing'}
          color={read ? '#BE945B' : 'red'}
          size={30}
        />
        <TouchableHighlight
          onPress={() => onSelect(idScream, idNotif)}
          style={{
            backgroundColor: read ? colors.background : '#28242A',
            width: 300,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 5,
          }}>
          <Text style={{color: '#95864D', marginLeft: 6}}>
            {sender} {type} your scream {dayjs(createdAt).fromNow()}
          </Text>
        </TouchableHighlight>
      </View>
    );
  };

  const onSelect = (idScream, idNotif) => {
    notificationMarkedRead(idNotif);
    getScreamNotificationed(idScream);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {userNotifications.length === 0 ? (
        <Text style={{color: colors.text}}>You don't have notifications</Text>
      ) : (
        <View>
          <View style={styles.container}>
            <SafeAreaView>
              <FlatList
                scrollEnabled
                data={userNotifications}
                renderItem={({item}) => (
                  <Item
                    createdAt={item.createdAt}
                    sender={item.sender}
                    type={item.type}
                    read={item.read}
                    onSelect={onSelect}
                    idScream={item.screamId}
                    idNotif={item.notificationId}
                  />
                )}
                keyExtractor={item => item.notificationId}
              />
            </SafeAreaView>
          </View>
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Scream has been close.');
              }}>
              <View style={styles.centeredView}>
                <View
                  style={[
                    styles.modalView,
                    {backgroundColor: colors.background},
                  ]}>
                  {scream == null ? (
                    <Avatar.Image
                      source={{
                        uri:
                          'https://firebasestorage.googleapis.com/v0/b/socialapplor.appspot.com/o/no-img.png?alt=media&token=78296785-3780-447f-b509-5606df0ad65a',
                      }}
                      size={50}
                    />
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Avatar.Image
                        source={{uri: scream.userImage}}
                        size={100}
                      />

                      <View style={{width: 200}}>
                        <Text
                          style={[
                            styles.modalText,
                            {color: '#BE945B', fontSize: 20},
                          ]}>
                          @ {scream.userHandle}
                        </Text>
                        <Text style={[styles.modalText, {color: '#95864D'}]}>
                          {scream.body}
                        </Text>
                        <Text style={[styles.modalText, {color: '#95864D'}]}>
                          {dayjs(scream.createdAt).fromNow()}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Icon name="ios-heart" size={20} color="#BE945B" />
                          <Text
                            style={{
                              paddingRight: 5,
                              paddingLeft: 5,
                              color: '#95864D',
                            }}>
                            {scream.likeCount} Likes
                          </Text>
                          <Icon name="ios-filing" size={20} color="#BE945B" />
                          <Text
                            style={{
                              paddingRight: 5,
                              paddingLeft: 5,
                              color: '#95864D',
                            }}>
                            {scream.commentCount} Comments
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: '#2196F3',
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    getUserNotifications();
                  }}>
                  <Icon name="ios-close" size={35} color="white" />
                </TouchableHighlight>
              </View>
            </Modal>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  img: {
    width: 150,
    height: 150,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  lightTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
  },
  modalView: {
    margin: 10,
    width: 350,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 40,
    alignItems: 'center',
    width: 35,
    height: 35,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
