import AsyncStorage from '@react-native-community/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import jwtDecode from 'jwt-decode';
import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Svg, {Path} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../components/context';

const ProfileScreen = ({navigation}) => {
  const [userDetails, setUserDetails] = React.useState();
  const [userToken, setUserToken] = React.useState();
  dayjs.extend(relativeTime);

  // Func to get the user details she's calling every time the user click on the view (edit profile details)
  function UserData() {
    useFocusEffect(
      React.useCallback(() => {
        let isActive = true;
        const getUserData = async () => {
          try {
            const feedUT = await AsyncStorage.getItem('userToken');
            setUserToken(feedUT);
            const FBIToken = `Bearer ${feedUT}`;
            axios.defaults.headers.common['Authorization'] = FBIToken;
            if (isActive) {
              axios
                .get(
                  'https://europe-west3-socialapplor.cloudfunctions.net/api/user',
                )
                .then(res => {
                  const data = res.data;
                  setUserDetails(data.credentials);
                });
            }
          } catch (e) {
            console.log(e);
          }
        };
        getUserData();

        return () => {
          isActive = false;
        };
      }, []),
    );
    return null;
  }

  const theme = useTheme();
  const {colors} = useTheme();
  const {signOut} = React.useContext(AuthContext);

  if (userToken) {
    const decodedToken = jwtDecode(userToken);
    if (decodedToken.exp * 1000 < Date.now()) {
      signOut();
    }
  }

  /*const options = {
    title: 'Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const pickPicture = options => {
    ImagePicker.launchImageLibrary(options, response => {
      setImage(response.uri);
      storeImage(response.uri);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
      }
    });
  };*/

  return (
    <View style={styles.container}>
      <UserData />
      {userDetails == null ? (
        <Text style={[styles.textTitle, {color: colors.text}]}>
          Wait to see details
        </Text>
      ) : (
        <View style={theme.dark ? styles.lightTheme : styles.darkTheme}>
          <View style={{flex: 1}}>
            <Image
              source={{uri: userDetails.imageUrl}}
              style={styles.img}
              resizeMode="cover"
            />
          </View>
          {/*<View style={styles.buttonUploadImg}>
            <TouchableHighlight
              onPress={() => pickPicture(options)}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#66B7A3',
              }}>
              <Icon name="ios-brush" size={25} color={colors.background} />
            </TouchableHighlight>
          </View>
          <View style={styles.buttonDeleteImg}>
            <TouchableHighlight
              onPress={() => removeImage()}
              style={{
                width: 35,
                height: 35,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#A24F44',
              }}>
              <Icon name="ios-close" size={35} color={colors.background} />
            </TouchableHighlight>
            </View>*/}
          <View style={[styles.editContainer, {backgroundColor: '#BE945B'}]}>
            <Button
              title="Edit Profile Details"
              color={colors.text}
              onPress={() =>
                navigation.navigate('EditProfile', {
                  bio: userDetails.bio,
                  location: userDetails.location,
                  website: userDetails.website,
                })
              }
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={{color: '#BE945B', paddingBottom: 10, fontSize: 30}}>
              @{userDetails.handle}
            </Text>
            {(userDetails.location === 'Freljord' && (
              <Text style={styles.freljord}>{userDetails.bio}</Text>
            )) ||
              (userDetails.location === 'Ionia' && (
                <Text style={styles.ionia}>{userDetails.bio}</Text>
              )) ||
              (userDetails.location === 'Bilgewater' && (
                <Text style={styles.bilgewater}>{userDetails.bio}</Text>
              )) ||
              (userDetails.location === 'Piltover & Zaun' && (
                <Text style={styles.piltoverandzaun}>{userDetails.bio}</Text>
              )) ||
              (userDetails.location === 'Noxus' && (
                <Text style={styles.noxus}>{userDetails.bio}</Text>
              )) ||
              (userDetails.location === 'Demacia' && (
                <Text style={theme.dark ? styles.darkThemeTx : styles.demacia}>
                  {userDetails.bio}
                </Text>
              )) ||
              (userDetails.location === 'Shadow Ilses' && (
                <Text style={styles.shadowilses}>{userDetails.bio}</Text>
              )) ||
              (userDetails.bio && (
                <Text
                  style={theme.dark ? styles.darkThemeTx : styles.lightThemeTx}>
                  {userDetails.bio}
                </Text>
              ))}
            {(userDetails.location === 'Freljord' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Svg height="30" width="30" viewBox="0 0 40 40">
                  <Path
                    d="M16.383 9.564s-4.034 4.295-4.632 4.813c-.597.52-.374 1.04-.037 1.651.336.613 1.564 2.398 1.564 2.398l2.26-2.317-.852-1.303 1.15-1.128s2.006 2.525 1.84 2.847c-.166.322-4.054 3.841-4.69 4.36-.634.518-.83 1.004-.531 1.991.36 1.193.71 2.127.71 2.127s5.822-6.283 6.98-7.13c1.158-.85.897-1.934.448-2.689l-4.21-5.62zM23.61 10.027l-2.235 2.48s1.68 1.703 1.792 2.717c.112 1.015.305 8.482.42 9.294.111.812.41.202.557-.366.15-.568 2.052-7.055 2.276-7.623.222-.568.557-1.219.93-1.34.372-.123 4.314-2.53 4.314-2.53s.41-.447-.187-.69l-7.868-1.942zM9.145 9.619l2.234 2.479s-1.68 1.704-1.793 2.718c-.113 1.015-.306 8.483-.418 9.294-.112.812-.41.202-.558-.366-.15-.568-2.052-7.054-2.276-7.623-.222-.568-.557-1.218-.93-1.34-.372-.123-4.314-2.53-4.314-2.53s-.41-.447.186-.691l7.869-1.941zM13.763 26.54l2.34-2.321s.932 1.813 1.156 2.095c.224.283.835-1.89.835-1.89l-.854-1.428 1.994-2.217s.465.51.592.793c.128.282.543.606.16 2.058s-3.603 9.899-3.603 9.899l-2.62-6.988zM13.38 10.53l3.003-4V4.446s-1.753-.15-3.003 1.035l-4.437.048L10.25 2.7l1.574.208-.154.937 1.939.028.792-2.642L8.907.612 4.383 8.553l6-.858 2.997 2.835z"
                    transform="translate(-387.813 -139.793) translate(387 139.89)"
                    stroke="#9DD6F0"
                    fill="#9DD6F0"
                  />
                  <Path
                    d="M19.384 10.53l-3.003-4V4.446s1.753-.15 3.003 1.035l4.437.048-1.308-2.83-1.574.208.335.937-1.94.028-.972-2.642 5.495-.618 4.524 7.941-6-.858-2.997 2.835z"
                    transform="translate(-387.813 -139.793) translate(387 139.89)"
                    stroke="#9DD6F0"
                    fill="#9DD6F0"
                  />
                </Svg>
                <Text style={styles.freljord}>{userDetails.location}</Text>
              </View>
            )) ||
              (userDetails.location === 'Ionia' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Svg height="30" width="30" viewBox="0 0 40 40">
                    <Path
                      d="M22.62 9.596c.26.474.319 1.024-.086 1.382-.406.357-1.278.098-1.437-.418-.73-2.37-1.826-2.93-3.193-3.893-.442-.31 3.415.567 4.716 2.929m6.274 6.479c-3 11.799-8.78 12.958-12.835 12.79-6.258-.26-8.473-5.38-8.441-9.043.028-3.208 3.32-8.125 7.274-8.432 7.228-.56 9 4.685 9 4.685s5.002-4.911-.996-11.998C21.306 2.2 19.01.109 13.892.109c0 0 2.792.91 3.959 3.004C9.226.588 3.58 4.765 3.58 4.765c1.969-.816 5.29.336 5.29.336C2.846 7.62.894 14.079.894 14.079c1.994-2.336 4-3.002 4-3.002-1.304 1.3-4.251 6.866-1.998 13 2.254 6.136 12.832 10.852 20 5.86 6.33-4.408 5.998-13.862 5.998-13.862"
                      transform="translate(-2.813 -140.793) translate(2 140.89)"
                      stroke="#C5869B"
                      fill="#C5869B"
                    />
                    <Path
                      d="M19.896 20.39c0 1.78-1.551 3.224-3.464 3.224s-3.464-1.444-3.464-3.224c0-2.915 4.177-6.177 4.177-4.396 0 1.296 2.751 2.616 2.751 4.396"
                      transform="translate(-2.813 -140.793) translate(2 140.89)"
                      stroke="#C5869B"
                      fill="#C5869B"
                    />
                  </Svg>
                  <Text style={styles.ionia}>{userDetails.location}</Text>
                </View>
              )) ||
              (userDetails.location === 'Bilgewater' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Svg height="30" width="30" viewBox="0 0 40 40">
                    <Path
                      d="M17 23.3c-.1-1.1 1.9-2.3 3.6-3 .6-.2.5 1 .6 1.6 0 3.3.3 6.5-1.8 9.4-.6.9-1.5 1.6-2.5 2.1-.4.2-.8.3-1.2 0-.3-.3-.1-.7.1-1 .6-1.4 1.6-5.4 1.2-9.1zM21.5 28.5c.3-.9.3-2 .3-2.7 0-.5-.1-.4.4-.6 3-1.2 2.4-2.4 1.3-4.2-.1-.1-.2-.3.1-.4.6-.5 3.3 1.8 3.3 3.4.2 1.9-1.7 3.6-5.4 4.5zM9.2 14.8c.4.3.9.3 1.3.2l.8.1-.2-.6s0-.1.1-.1c0 0-.1.4 0 .3l1.1-.3-.7-.9v-.1l.7-.6s-.5-.2-.7-.2c0-.2-.1-.3-.2-.5.5-.6.9-1.1 1.6-2-.2 1.1-.1 1.6.6 2-.2.4-.6.8-.5 1.1.6 1.4-.3 2-1.1 2.7-.1.1-.3.3-.4.3-.3.1-.7-.1-.7.5.1.5.5.4.9.4 3.9 0 4.6-4 4.6-6.2 0 0-.4-.3-.8-.7-.7-.7-1.7-2-2.1-2.6-.1-.2-.8.5-1.1.6 0-.5.6-.8.4-1.5-1.3.6-2.2 1.5-2.7 2.8-.4 1-.7.4-1-.1-.3 1.1-.7 2-.6 3.1 0 .4-.1.9 0 1.3.1.3.3.7.7 1m.5-1.7c-.5-.2 0-1.1.1-1.4.2-.5.5.1.6.9 0 .3-.4.6-.7.5z"
                      stroke="#A54B32"
                      fill="#A54B32"
                    />
                    <Path
                      d="M20.5 2.4L19.1.9c-.2-.2-.4-.2-.6 0-.3.3-.8.9-1.2 1.3-.2.2-.2.6 0 .8l.7.7V8s-2-.6-3-2c-.3-.5-1.7 1.2 2.3 4.3v4.2c0 .2.1.3.3.2.9-.3 3.2-1 3.2-1.8v-3s3.1-1 3.2-3.9c.2-2.9-3.5-3.6-3.5-3.6zm-.4 5.3V4.6s2 .3 1.8 1.6c0 1.2-1.8 1.5-1.8 1.5z"
                      stroke="#A54B32"
                      fill="#A54B32"
                    />
                    <Path
                      d="M23.8 10.2c-.1-.1-.4-.2-.5 0l-1.3 1c-.2.1-.3.2-.3.4l.1 1.7c.1 1.9-10.6 3.2-10.1 9.2 0 .4.1 2.1.7 1.9.2-.1 0-.8 0 0-.1 2.6 2.5 3.9 3.3 4.6.4.3.7-4.4.5-4.7-.3-.4-.6-1-.6-1.2-.3-1.7 6.8-5 6.8-5 .1.1.1.5.1.7 0 .2.2.3.3.2 1.6-.5 5.6-4 1-8.8z"
                      stroke="#A54B32"
                      fill="#A54B32"
                    />
                  </Svg>
                  <Text style={styles.bilgewater}>{userDetails.location}</Text>
                </View>
              )) ||
              (userDetails.location === 'Piltover & Zaun' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Svg height="30" width="30" viewBox="0 0 40 40">
                    <Path
                      d="M18.648 24.642c.009.892.02 2.444.02 2.444-.207.105-1.444 1.162-1.659 1.252l-.012 1.732s-.585 1.13-1.352 1.13c-.768 0-1.354-1.13-1.354-1.13l-.013-1.733c-.213-.09-1.45-1.146-1.657-1.252 0 0 .01-1.453.02-2.355a7.006 7.006 0 012.91-13.382 7.005 7.005 0 013.096 13.293zm10.747-11.986l-1.26.671-.018 2.569-2.562-1.538.015-7.03-2.06-1.206-1.947 1.196V9.96l-2.556-1.604.015-5.917-3.47-2.083-3.457 2.082.015 5.918-2.555 1.604V7.317L7.606 6.122l-2.06 1.205.015 7.031L3 15.895l-.018-2.567-1.258-.671-1.175.701.021 4.846s3.654 2.152 3.654 5.799c0 0 1.513 2.857 2.333 2.855.486-.002 1.499-1.16 2-1.526.507.273 1.007.395 1.007.82v1.916l1.898 1.29c.51.345.793.805.793 1.28v.516l3.312 3.204 3.296-3.203v-.517c0-.476.285-.935.794-1.28l1.9-1.29v-1.916c0-.425.5-.547 1.005-.82.503.366 1.515 1.524 2.002 1.526.819.002 2.332-2.855 2.332-2.855 0-3.646 3.652-5.799 3.652-5.799l.021-4.846-1.173-.702z"
                      stroke="#D39C74"
                      fill="#D39C74"
                    />
                    <Path
                      d="M13.6118 19.7469L13.3548 21.0159 14.4938 21.6729 15.6438 20.6729 16.7848 21.6799 17.9238 21.0219 17.6628 19.7329 17.6188 19.5289 17.8388 19.4519 19.1458 19.0139 19.1458 17.6989 17.8388 17.2599 17.6238 17.1889 17.9238 15.6949 16.7848 15.0369 15.8118 15.8959 15.6448 16.0489 15.4578 15.8959 14.4938 15.0449 13.3548 15.7019 13.6068 16.9429 13.6608 17.1899 12.1428 17.6979 12.1428 19.0139 13.6488 19.5179z"
                      stroke="#D39C74"
                      fill="#D39C74"
                    />
                  </Svg>
                  <Text style={styles.piltoverandzaun}>
                    {userDetails.location}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Noxus' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Svg height="30" width="30" viewBox="0 0 40 40">
                    <Path
                      d="M16.586 2.475v11.046c0 .901.28 1.365.996 1.66.715.295 3.984-1.944 3.984-1.944s-.948 2.608-1.233 3.083c-.284.474-.711.948-1.565.76-.854-.19-.89-.718-1.203-.502-.315.216-.884.976-.884 3.395 0 2.42-.048 10.626-.048 10.626s1.139-1.85 2.229-2.42c1.092-.569 1.282-1.66.996-2.324-.284-.665-.758-3.89.048-5.503.807-1.613 2.515-3.416 3.274-3.7.759-.285 1.376-.332 1.09.76-.284 1.09-2.134 1.802-2.277 4.506-.141 2.704 2.895 4.459 2.895 4.459s-1.614-3.178 1.09-5.076c2.705-1.897 4.745-4.411 5.124-6.214.38-1.803.332-4.223-.332-4.791-.664-.57-1.518.332-2.562-1.044-1.044-1.377 1.09-2.183.664-2.942-.427-.758-3.795-5.597-8.728-5.834 4.08 2.75 5.17 7.78 2.18 9.63-2.987 1.85-3.746-1.14-3.746-3.037V5.476l-1.992-3zM15.058 2.475v11.046c0 .901-.28 1.365-.996 1.66-.716.295-3.984-1.944-3.984-1.944s.948 2.608 1.232 3.083c.285.474.712.948 1.566.76.854-.19.888-.718 1.203-.502.315.216.884.976.884 3.395 0 2.42.047 10.626.047 10.626s-1.138-1.85-2.23-2.42c-1.09-.569-1.28-1.66-.995-2.324.285-.665.758-3.89-.047-5.503-.807-1.613-2.515-3.416-3.274-3.7-.76-.285-1.376-.332-1.091.76.285 1.09 2.135 1.802 2.277 4.506.142 2.704-2.894 4.459-2.894 4.459S8.37 23.198 5.665 21.3C2.96 19.404.92 16.89.542 15.086c-.38-1.803-.332-4.223.332-4.791.664-.57 1.518.332 2.562-1.044 1.043-1.377-1.091-2.183-.664-2.942C3.199 5.553 6.567.713 11.5.477c-4.08 2.75-5.171 7.78-2.182 9.63 2.989 1.85 3.748-1.14 3.748-3.037V5.476l1.992-3z"
                      transform="translate(-327.813 -40.793) translate(328 40.89)"
                      stroke="#A24F44"
                      fill="#A24F44"
                    />
                  </Svg>
                  <Text style={styles.noxus}>{userDetails.location}</Text>
                </View>
              )) ||
              (userDetails.location === 'Demacia' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Svg height="30" width="30" viewBox="0 0 40 40">
                    <Path
                      d="M28.767 21.376c-.861.997-2.011 1.687-2.697 1.739.34-.446 2.657-2.473 2.765-3.573.087-.88-.051-1.958-.605-1.036-.738 1.23-3.16 3.029-3.93 3.317.199-.592 1.738-2.732 2.648-3.556.599-.543 1.11-1.248 1.073-1.883-.034-.58-.436-2.33-.69-1.652-.163.443-.967 1.869-1.51 2.529-.494.6-2.291 2.49-2.173 2.28-.091-.948 1.38-3.342 2.173-4.3.387-.47.772-1.18.796-1.801.037-1.01-.612-3.09-.89-2.182-.516 1.683-2.184 4.958-3.32 5.852-.073-.122.129-1.682.506-2.46.588-1.22 1.5-2.774 2.008-4.476.368-1.228.095-2.477-.991-3.738-.778-.906-.966-1.627-1.202.752a50.312 50.312 0 01-.693 4.608c-.315 1.598-1.456 3.869-2.08 5.557-.118.32.288 1.34.592 1.507 1.295.705 1.513 1.61 1.126 2.8-.971 2.994-1.84 2.059-3.163.84-.48-.441-1.614-1.291-.684-2.824.117-.194.177-.33.08-.517-.628-1.205-.827-2.452-.895-3.72-.127-2.38.212-5.71 1.566-7.938.1-.166.082-.313.04-.482-.6-2.407-2.264-4.574-3.817-6.752v33.998c.12.015.239-.022.373-.111.655-.434 1.357-.835 1.859-1.363.197-.207.228-.373.069-.594-.98-1.362-.921-3.8-.67-5.25.033-.191.118-.435.44-.295 0 0 6.254 1.515 9.629-1.047.542-.412 1.559-1.553 2.044-2.476.483-.917.678-2.28.223-1.753M10.977 7.018c-.042.17-.06.317.04.482 1.353 2.23 1.692 5.56 1.565 7.94-.068 1.266-.267 2.514-.895 3.718-.097.187-.037.323.081.517.93 1.533-.206 2.384-.685 2.825-1.323 1.22-2.19 2.153-3.163-.84-.386-1.19-.168-2.095 1.126-2.8.305-.167.512-1.014.39-1.327-.649-1.645-1.563-4.14-1.877-5.737a50.77 50.77 0 01-.694-4.608c-.236-2.38-.423-1.658-1.202-.753-1.085 1.262-1.358 2.51-.99 3.738.508 1.702 1.42 3.257 2.01 4.476.375.778.576 2.34.504 2.46-1.137-.893-2.805-4.169-3.32-5.852-.279-.906-.928 1.173-.89 2.183.024.621.408 1.331.796 1.8.792.96 2.263 3.353 2.173 4.301.118.21-1.679-1.68-2.173-2.28-.543-.66-1.347-2.087-1.512-2.529-.253-.677-.654 1.072-.689 1.652-.037.634.475 1.34 1.074 1.883.91.824 2.448 2.964 2.646 3.556-.768-.289-3.19-2.087-3.928-3.317-.554-.923-.693.155-.606 1.035.11 1.1 2.426 3.127 2.766 3.573-.687-.05-1.837-.742-2.697-1.739-.455-.527-.26.836.222 1.753.486.924 1.691 2.202 2.242 2.601 3.504 2.537 9.43.922 9.43.922.323-.14.408.105.441.297.252 1.45.31 3.886-.67 5.248-.16.222-.127.387.07.594.502.53 1.204.93 1.858 1.364.134.088.252.126.373.11V.266c-1.552 2.178-3.217 4.346-3.816 6.752"
                      transform="translate(-206.813 -40.793) translate(207 40.89)"
                      stroke="#EEEEE9"
                      fill="#EEEEE9"
                    />
                  </Svg>
                  <Text
                    style={theme.dark ? styles.darkThemeTx : styles.demacia}>
                    {userDetails.location}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Shadow Ilses' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Svg height="30" width="30" viewBox="0 0 40 40">
                    <Path
                      d="M20.996 17.155s-3.113-3.813-5.37-6.359c-1.442-1.625-2.847-4.494-2.847-4.494s-1.278 2.876-2.897 4.556c-1.51 1.568-3.844 4.05-3.844 4.05-.64-.945.962-4.529.962-4.529s-2.662 1.48-3.663 4.375c-.717 2.073-1.82 6.436 1.025 9.936 0 0-1.285-7.832 8.417-9.832 0 0 7.775.114 8.192 9.102 0 0-4.893 3.414-7.997 3.414-3.2 0-4.795-1.496-5.753-3.414 1.176-1.84 2.552-4.117 5.753-4.057 3.278.063 4.99 2.912 4.99 2.912s-1.218-5.142-4.99-5.142c-3.829 0-5.436 3.06-6.842 6.287 1.145 3.365 3.013 5.99 6.842 5.99 0 0 3.487.288 7.631-2.097 0 0-2.374 4.61-7.842 4.526C5.37 32.266 1.634 26.684.554 20.355-1.91 35.09 12.711 34.858 12.711 34.858c8.055 0 13.218-5.666 13.218-9.998 0-4.209-.938-7.897-2.666-9.585-1.722-1.68-3.5-2.415-3.5-2.415s1.622 2.374 1.233 4.295"
                      transform="translate(-271.813 -138.793) translate(272 137.89)"
                      stroke="#66B7A3"
                      fill="#66B7A3"
                    />
                    <Path
                      d="M14.764 23.96a1.983 1.983 0 11-3.967 0 1.983 1.983 0 013.967 0M14.764.86s.384 1.8 2.009 2.967 3.365 2.468 3.573 6.03c0 0-1.833-1.916-3.89-2.999-1.95-1.028-2.54-3.992-1.692-5.998"
                      transform="translate(-271.813 -138.793) translate(272 137.89)"
                      stroke="#66B7A3"
                      fill="#66B7A3"
                    />
                  </Svg>
                  <Text style={styles.shadowilses}>{userDetails.location}</Text>
                </View>
              )) ||
              (userDetails.location && (
                <View style={{flexDirection: 'row'}}>
                  {theme.dark ? (
                    <Icon name="ios-pin" color="black" size={20} />
                  ) : (
                    <Icon name="ios-pin" color="#fff" size={20} />
                  )}
                  <Text
                    style={
                      theme.dark ? styles.darkThemeTx : styles.lightThemeTx
                    }>
                    {userDetails.location}
                  </Text>
                </View>
              ))}
            {(userDetails.location === 'Freljord' && (
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-link" color="#9DD6F0" size={20} />
                <Text style={styles.freljord}>{userDetails.website}</Text>
              </View>
            )) ||
              (userDetails.location === 'Ionia' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-link" color="#C5869B" size={20} />
                  <Text style={styles.ionia}>{userDetails.website}</Text>
                </View>
              )) ||
              (userDetails.location === 'Bilgewater' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-link" color="#A54B32" size={20} />
                  <Text style={styles.bilgewater}>{userDetails.website}</Text>
                </View>
              )) ||
              (userDetails.location === 'Piltover & Zaun' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-link" color="#D39C74" size={20} />
                  <Text style={styles.piltoverandzaun}>
                    {userDetails.website}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Noxus' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-link" color="#A24F44" size={20} />
                  <Text style={styles.noxus}>{userDetails.website}</Text>
                </View>
              )) ||
              (userDetails.location === 'Demacia' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-link" color="#EEEEE9" size={20} />
                  <Text
                    style={theme.dark ? styles.darkThemeTx : styles.demacia}>
                    {userDetails.website}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Shadow Ilses' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-link" color="#66B7A3" size={20} />
                  <Text style={styles.shadowilses}>{userDetails.website}</Text>
                </View>
              )) ||
              (userDetails.website && (
                <View style={{flexDirection: 'row'}}>
                  {theme.dark ? (
                    <Icon name="ios-link" color="black" size={20} />
                  ) : (
                    <Icon name="ios-link" color="#fff" size={20} />
                  )}
                  <Text
                    style={
                      theme.dark ? styles.darkThemeTx : styles.lightThemeTx
                    }>
                    {userDetails.website}
                  </Text>
                </View>
              ))}

            {(userDetails.location === 'Freljord' && (
              <View style={{flexDirection: 'row'}}>
                <Icon name="ios-calendar" color="#9DD6F0" size={20} />
                <Text style={styles.freljord}>
                  Joined {dayjs(userDetails.createdAt).fromNow()}
                </Text>
              </View>
            )) ||
              (userDetails.location === 'Ionia' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-calendar" color="#C5869B" size={20} />
                  <Text style={styles.ionia}>
                    Joined {dayjs(userDetails.createdAt).fromNow()}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Bilgewater' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-calendar" color="#A54B32" size={20} />
                  <Text style={styles.bilgewater}>
                    Joined {dayjs(userDetails.createdAt).fromNow()}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Piltover & Zaun' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-calendar" color="#D39C74" size={20} />
                  <Text style={styles.piltoverandzaun}>
                    Joined {dayjs(userDetails.createdAt).fromNow()}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Noxus' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-calendar" color="#A24F44" size={20} />
                  <Text style={styles.noxus}>
                    Joined {dayjs(userDetails.createdAt).fromNow()}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Demacia' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-calendar" color="#EEEEE9" size={20} />
                  <Text
                    style={theme.dark ? styles.darkThemeTx : styles.demacia}>
                    Joined {dayjs(userDetails.createdAt).fromNow()}
                  </Text>
                </View>
              )) ||
              (userDetails.location === 'Shadow Ilses' && (
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-calendar" color="#66B7A3" size={20} />
                  <Text style={styles.shadowilses}>
                    Joined {dayjs(userDetails.createdAt).fromNow()}
                  </Text>
                </View>
              )) ||
              (userDetails.createdAt && (
                <View style={{flexDirection: 'row'}}>
                  {theme.dark ? (
                    <Icon name="ios-calendar" color="black" size={20} />
                  ) : (
                    <Icon name="ios-calendar" color="#fff" size={20} />
                  )}
                  <Text
                    style={
                      theme.dark ? styles.darkThemeTx : styles.lightThemeTx
                    }>
                    Joined {dayjs(userDetails.createdAt).fromNow()}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 90,
    position: 'relative',
  },
  buttonUploadImg: {
    position: 'absolute',
    right: 85,
    top: 145,
  },
  buttonDeleteImg: {
    position: 'absolute',
    left: 85,
    top: 145,
  },
  editContainer: {
    marginTop: 70,
    alignItems: 'center',
    borderRadius: 10,
  },
  darkTheme: {
    width: 350,
    height: 450,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28242A',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  lightTheme: {
    width: 350,
    height: 450,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  textContainer: {flex: 2, alignItems: 'center', justifyContent: 'center'},
  lightThemeTx: {
    color: '#fff',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  darkThemeTx: {
    color: 'black',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  freljord: {
    color: '#9DD6F0',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  ionia: {
    color: '#C5869B',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  bilgewater: {
    color: '#A54B32',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  piltoverandzaun: {
    color: '#D39C74',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  noxus: {
    color: '#A24F44',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  demacia: {
    color: '#EEEEE9',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  shadowilses: {
    color: '#66B7A3',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
});

export default ProfileScreen;
