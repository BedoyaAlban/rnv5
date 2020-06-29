import AsyncStorage from '@react-native-community/async-storage';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import axios from 'axios';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddScreamScreen from './AddScreamScreen';
import EditProfileScreen from './EditProfileScreen';
import ExploreScreen from './ExploreScreen';
import HomeScreen from './HomeScreen';
import NotificationsScreen from './NotificationsScreen';
import ProfileScreen from './ProfileScreen';

const HomeStack = createStackNavigator();
const NotificationsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
  const [userNotifications, setUserNotifications] = useState();
  // Func to get the number of notifications to display inside the panel
  const userDataNotifications = async () => {
    try {
      const feedUT = await AsyncStorage.getItem('userToken');
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
  // View containing the icon with the panel
  const IconWithBadge = ({name, badgeCount, color, size}) => {
    return (
      <View style={{width: 28, height: 28, margin: 1}}>
        <Icon name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  };
  //view using data to display the number of notifications dynamically
  const NotificationsIconWithBadge = props => {
    return (
      <IconWithBadge
        {...props}
        badgeCount={
          userNotifications == null
            ? 0
            : userNotifications.filter(not => not.read === false).length
        }
      />
    );
  };
  return (
    <Tab.Navigator initialRouteName="Home" activeColor="#D5D2CA">
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        listeners={{
          focus: () => {
            userDataNotifications();
          },
        }}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#28242A',
          tabBarIcon: ({color}) => {
            return <Icon name="ios-home" color={color} size={26} />;
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsStackScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarColor: '#76A1B4',
          tabBarIcon: ({color}) => {
            return (
              <NotificationsIconWithBadge
                name="ios-notifications"
                color={color}
                size={26}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        listeners={{
          focus: () => {
            userDataNotifications();
          },
        }}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#BE945B',
          tabBarIcon: ({color}) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        listeners={{
          focus: () => {
            userDataNotifications();
          },
        }}
        options={{
          tabBarLabel: 'Explore',
          tabBarColor: '#7A3B33',
          tabBarIcon: ({color}) => (
            <Icon name="ios-aperture" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#28242A',
        },
        headerTintColor: '#D5D2CA',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Screams',
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#28242A"
              onPress={() => navigation.openDrawer()}></Icon.Button>
          ),
        }}
      />
      <HomeStack.Screen
        name="addScream"
        component={AddScreamScreen}
        options={{title: 'Add Scream'}}
      />
    </HomeStack.Navigator>
  );
};

const NotificationsStackScreen = ({navigation}) => {
  return (
    <NotificationsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#76A1B4',
        },
        headerTintColor: '#D5D2CA',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <NotificationsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#76A1B4"
              onPress={() => navigation.openDrawer()}></Icon.Button>
          ),
        }}
      />
    </NotificationsStack.Navigator>
  );
};

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#BE945B',
      },
      headerTintColor: '#D5D2CA',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#BE945B"
            onPress={() => navigation.openDrawer()}></Icon.Button>
        ),
      }}
    />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
  </ProfileStack.Navigator>
);
