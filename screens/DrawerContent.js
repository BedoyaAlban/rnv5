import AsyncStorage from '@react-native-community/async-storage';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Avatar,
  Caption,
  Drawer,
  Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../components/context';

export function DrawerContent(props) {
  const paperTheme = useTheme();
  const [userDetails, setUserDetails] = useState();
  const [userLikes, setUserLikes] = useState();
  const [userComments, setUserComments] = useState();
  // const [img, setImg] = useState();
  // Func to get all the details of the user (name, likes , notifications ....)
  const getUserData = useCallback(async () => {
    try {
      const feedUT = await AsyncStorage.getItem('userToken');
      const FBIToken = `Bearer ${feedUT}`;
      axios.defaults.headers.common['Authorization'] = FBIToken;

      axios
        .get('https://europe-west3-socialapplor.cloudfunctions.net/api/user')
        .then(res => {
          const data = res.data;
          setUserDetails(data.credentials);
          setUserLikes(data.notifications);
          setUserComments(data.notifications);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  /*const getUserImg = useCallback(async () => {
    let userImg;
    try {
      userImg = await AsyncStorage.getItem('userImg');
      if (userImg) {
        setImg(userImg);
      } else {
        setImg(null);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);*/

  useEffect(() => {
    getUserData();
    // getUserImg();
  }, []);

  const {signOut, toggleTheme} = React.useContext(AuthContext);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              {userDetails == null ? (
                <Avatar.Image
                  source={{
                    uri:
                      'https://firebasestorage.googleapis.com/v0/b/socialapplor.appspot.com/o/no-img.png?alt=media&token=78296785-3780-447f-b509-5606df0ad65a',
                  }}
                  size={50}
                />
              ) : (
                <Avatar.Image source={{uri: userDetails.imageUrl}} size={50} />
              )}
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                {userDetails == null ? (
                  <Text>User Name</Text>
                ) : (
                  <Title style={styles.title}>{userDetails.handle}</Title>
                )}
                {userDetails == null ? (
                  <Text>@username</Text>
                ) : (
                  <Caption style={styles.caption}>
                    @{userDetails.handle}
                  </Caption>
                )}
              </View>
            </View>
            <View style={styles.row}>
              {userLikes == null ? (
                <View style={styles.section}>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    0
                  </Paragraph>
                  <Caption style={styles.caption}>Likes</Caption>
                </View>
              ) : (
                <View style={styles.section}>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    {userLikes.filter(not => not.type == 'like').length}
                  </Paragraph>
                  <Caption style={styles.caption}>Likes</Caption>
                </View>
              )}
              {userComments == null ? (
                <View style={styles.section}>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    0
                  </Paragraph>
                  <Caption style={styles.caption}>Notifications</Caption>
                </View>
              ) : (
                <View style={styles.section}>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    {userComments.length}
                  </Paragraph>
                  <Caption style={styles.caption}>Notifications</Caption>
                </View>
              )}
            </View>
            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="home-outline" color={color} size={size} />
                )}
                label="Home"
                onPress={() => {
                  props.navigation.navigate('Home');
                }}
              />
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="account-outline" color={color} size={size} />
                )}
                label="Profile"
                onPress={() => {
                  props.navigation.navigate('Profile');
                }}
              />
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="map-search" color={color} size={size} />
                )}
                label="Explore"
                onPress={() => {
                  props.navigation.navigate('Explore');
                }}
              />
            </Drawer.Section>
            <Drawer.Section title="Preferences">
              <TouchableRipple
                onPress={() => {
                  toggleTheme();
                }}>
                <View style={styles.preference}>
                  <Text style={{marginRight: 97}}>Dark Theme</Text>
                  <View pointerEvents="none">
                    <Switch value={paperTheme.dark} />
                  </View>
                </View>
              </TouchableRipple>
            </Drawer.Section>
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => signOut()}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
