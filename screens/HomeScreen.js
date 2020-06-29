import AsyncStorage from '@react-native-community/async-storage';
import {useTheme} from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import jwtDecode from 'jwt-decode';
import React from 'react';
import {
  Alert,
  Image,
  Modal,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../components/context';

const HomeScreen = ({navigation}) => {
  const [screams, setScreams] = React.useState();
  const [handleUser, setUserHandle] = React.useState();
  const [userLikes, setUserLikes] = React.useState();
  const [comments, setComments] = React.useState();
  const [screamToComment, setScreamToComment] = React.useState();
  const [modalDelete, setModalDelete] = React.useState(false);
  const [modalComment, setModalComment] = React.useState(false);
  const [comment, setComment] = React.useState({
    body: 'post a comment',
    isValidComment: true,
  });
  const [idScream, setIdScream] = React.useState();
  const [userToken, setUserToken] = React.useState();
  dayjs.extend(relativeTime);

  // Get user details retrieving the token in the storage
  const getUser = async () => {
    try {
      const feedUT = await AsyncStorage.getItem('userToken');
      setUserToken(feedUT);
      const FBIToken = `Bearer ${feedUT}`;
      axios.defaults.headers.common['Authorization'] = FBIToken;

      axios
        .get('https://europe-west3-socialapplor.cloudfunctions.net/api/user')
        .then(res => {
          const user = res.data.credentials.handle;
          const likesUser = res.data.likes;
          setUserLikes(likesUser);
          setUserHandle(user);
        });
    } catch (e) {
      console.log(e);
    }
  };

  // Request for getting all the screams
  const getAllScreams = () => {
    axios
      .get('https://europe-west3-socialapplor.cloudfunctions.net/api/screams')
      .then(res => {
        const data = res.data;
        setScreams(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    getUser();
    getAllScreams();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  // Function to activate the reload on the pull up on the scrollview
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    axios
      .get('https://europe-west3-socialapplor.cloudfunctions.net/api/screams')
      .then(res => {
        const data = res.data;
        setScreams(data);
        setRefreshing(false);
      })
      .catch(err => console.log(err));
  }, [refreshing]);

  // Func to show the modal and delete the scream selected
  const modalToDelete = screamId => {
    setModalDelete(true);
    setIdScream(screamId);
  };

  // Func to get all the details and the likes and the comments of the scream selected
  const getScream = screamId => {
    axios
      .get(
        `https://europe-west3-socialapplor.cloudfunctions.net/api/scream/${screamId}`,
      )
      .then(res => {
        const scream = res.data;
        const coms = res.data.comments;
        setScreamToComment(scream);
        setComments(coms);
        setIdScream(screamId);
        setModalComment(true);
      })
      .catch(err => console.log(err));
  };

  // Func to delete the scream selected
  const deleteScream = screamId => {
    axios
      .delete(
        `https://europe-west3-socialapplor.cloudfunctions.net/api/scream/${screamId}`,
      )
      .then(() => {
        Alert.alert('Scream deleted successfully!');
        setModalDelete(false);
        getAllScreams();
      })
      .catch(err => console.log(err));
  };

  // Func to like a scream and request the 2 principals func for the View
  const likeScream = screamId => {
    axios
      .get(
        `https://europe-west3-socialapplor.cloudfunctions.net/api/scream/${screamId}/like`,
      )
      .then(res => {
        getAllScreams();
        getUser();
      })
      .catch(err => console.log(err));
  };

  // Same but to unlike a scream
  const unlikeScream = screamId => {
    axios
      .get(
        `https://europe-west3-socialapplor.cloudfunctions.net/api/scream/${screamId}/unlike`,
      )
      .then(res => {
        getAllScreams();
        getUser();
      })
      .catch(err => console.log(err));
  };

  // Func to post a comment on the scream selected
  const submitComment = (screamId, commentData) => {
    axios
      .post(
        `https://europe-west3-socialapplor.cloudfunctions.net/api/scream/${screamId}/comment`,
        commentData,
      )
      .then(res => {
        getAllScreams();
        getUser();
      })
      .catch(err => console.log(err));
  };

  // Func to change the value inside the text input in real time
  const commentInputChange = val => {
    if (val.trim().length > 0) {
      setComment({
        ...comment,
        body: val,
        isValidComment: true,
      });
    } else {
      setComment({
        ...comment,
        isValidComment: false,
      });
    }
  };

  const theme = useTheme();
  const {colors} = useTheme();
  const {signOut} = React.useContext(AuthContext);

  /*const token = userToken;
  if (token) {
    if (jwtDecode(token) * 1000 < Date.now()) {
      signOut();
    }
  }*/

  // Func to logout the user if the token has expired
  if (userToken) {
    const decodedToken = jwtDecode(userToken);
    if (decodedToken.exp * 1000 < Date.now()) {
      signOut();
    }
  }

  // View contining a model of a scream and will be use for the flatlist
  const Item = ({
    body,
    createdAt,
    userHandle,
    image,
    likes,
    comments,
    screamId,
    styleBC,
    styleTx,
  }) => {
    return (
      <View style={styleBC}>
        <View style={{flex: 2}}>
          <Image source={{uri: image}} style={styles.img} resizeMode="cover" />
        </View>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.screamContainer}>
              <Text
                style={{
                  color: '#BE945B',
                  paddingBottom: 2,
                }}>
                {userHandle}
              </Text>
              <Text style={{color: '#95864D'}}>
                {dayjs(createdAt).fromNow()}
              </Text>
              <Text style={styleTx}>{body}</Text>
            </View>

            {handleUser == userHandle ? (
              <TouchableHighlight onPress={() => modalToDelete(screamId)}>
                <Icon name="ios-trash" size={25} color={colors.background} />
              </TouchableHighlight>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 10,
            }}>
            {userLikes && userLikes.find(like => like.screamId === screamId) ? (
              <TouchableHighlight
                onPress={() => unlikeScream(screamId)}
                style={{
                  width: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="ios-heart" size={20} color={colors.background} />
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                onPress={() => likeScream(screamId)}
                style={{
                  width: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="ios-heart-empty"
                  size={20}
                  color={colors.background}
                />
              </TouchableHighlight>
            )}

            <Text
              style={{
                paddingRight: 5,
                paddingLeft: 5,
                color: '#95864D',
              }}>
              {likes} Likes
            </Text>
            <TouchableHighlight
              onPress={() => getScream(screamId)}
              style={{
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="ios-filing" size={20} color="#BE945B" />
            </TouchableHighlight>
            <Text
              style={{
                paddingRight: 5,
                paddingLeft: 5,
                color: '#95864D',
              }}>
              {comments} Comments
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // View contining the comments to show
  const CommentToShow = ({body, createdAt, userHandle, styleBC, styleTx}) => (
    <View style={styleBC}>
      <View style={styles.screamContainer}>
        <Text
          style={{
            color: '#BE945B',
            paddingBottom: 2,
          }}>
          {userHandle}
        </Text>
        <Text style={{color: '#95864D'}}>{dayjs(createdAt).fromNow()}</Text>
        <Text style={styleTx}>{body}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{alignItems: 'center'}}>
        <TouchableHighlight
          onPress={() => navigation.navigate('addScream')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#28242A',
            marginBottom: 20,
          }}>
          <Icon name="ios-add" size={40} color={colors.background} />
        </TouchableHighlight>
        <FlatList
          data={screams}
          scrollEnabled
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => (
            <Item
              styleBC={theme.dark ? styles.lightTheme : styles.darkTheme}
              styleTx={theme.dark ? styles.lightThemeTx : styles.darkThemeTx}
              userHandle={item.userHandle}
              body={item.body}
              createdAt={item.createdAt}
              image={item.userImage}
              likes={item.likeCount}
              comments={item.commentCount}
              screamId={item.screamId}
            />
          )}
          keyExtractor={item => item.screamId}
        />
      </SafeAreaView>
      <View>
        <Modal animationType="slide" transparent={true} visible={modalDelete}>
          <View style={styles.centeredView}>
            <View
              style={[styles.modalView, {backgroundColor: colors.background}]}>
              <Text>Are you sure you want to delete this scream ?</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{margin: 10}}>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      backgroundColor: '#28242A',
                    }}
                    onPress={() => {
                      setModalDelete(!modalDelete);
                    }}>
                    <Icon name="ios-close" size={35} color="white" />
                  </TouchableHighlight>
                </View>
                <View style={{margin: 10}}>
                  <TouchableHighlight
                    onPress={() => deleteScream(idScream)}
                    style={{
                      ...styles.openButton,
                      backgroundColor: '#28242A',
                      paddingTop: 4,
                    }}>
                    <Icon name="ios-trash" size={25} color="#BE945B" />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <Modal animationType="slide" transparent={true} visible={modalComment}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, {backgroundColor: '#C5C6C7'}]}>
              <Text style={{fontWeight: 'bold', color: '#95864D'}}>
                Comment this scream
              </Text>
              {screamToComment ? (
                <View style={theme.dark ? styles.lightTheme : styles.darkTheme}>
                  <View style={{flex: 2}}>
                    <Image
                      source={{uri: screamToComment.userImage}}
                      style={styles.img}
                      resizeMode="cover"
                    />
                  </View>
                  <View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.screamContainer}>
                        <Text
                          style={{
                            color: '#BE945B',
                            paddingBottom: 2,
                          }}>
                          {screamToComment.userHandle}
                        </Text>
                        <Text style={{color: '#95864D'}}>
                          {dayjs(screamToComment.createdAt).fromNow()}
                        </Text>
                        <Text
                          style={
                            theme.dark
                              ? styles.lightThemeTx
                              : styles.darkThemeTx
                          }>
                          {screamToComment.body}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}>
                      {userLikes &&
                      userLikes.find(like => like.screamId === idScream) ? (
                        <Icon
                          name="ios-heart"
                          size={20}
                          color={colors.background}
                        />
                      ) : (
                        <Icon
                          name="ios-heart-empty"
                          size={20}
                          color={colors.background}
                        />
                      )}

                      <Text
                        style={{
                          paddingRight: 5,
                          paddingLeft: 5,
                          color: '#95864D',
                        }}>
                        {screamToComment.likeCount} Likes
                      </Text>
                      <Icon name="ios-filing" size={20} color="#BE945B" />
                      <Text
                        style={{
                          paddingRight: 5,
                          paddingLeft: 5,
                          color: '#95864D',
                        }}>
                        {screamToComment.commentCount} Comments
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
              {comments == null ? null : (
                <View style={{height: 200}}>
                  <FlatList
                    scrollEnabled
                    data={comments}
                    renderItem={({item}) => (
                      <CommentToShow
                        styleBC={
                          theme.dark
                            ? styles.lightThemeComment
                            : styles.darkThemeComment
                        }
                        styleTx={
                          theme.dark ? styles.lightThemeTx : styles.darkThemeTx
                        }
                        userHandle={item.userHandle}
                        body={item.body}
                        createdAt={item.createdAt}
                      />
                    )}
                    keyExtractor={item => item.createdAt}
                  />
                </View>
              )}
              <View
                style={{
                  backgroundColor: '#28242A',
                  alignItems: 'center',
                  width: 350,
                }}>
                <TextInput
                  onChangeText={val => commentInputChange(val)}
                  style={{
                    width: 200,
                    height: 100,
                    color: colors.background,
                    textAlign: 'center',
                  }}
                  defaultValue={comment.body}
                  multiline
                  numberOfLines={6}
                  maxLength={140}
                />
              </View>
              {comment.isValidComment ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={{color: 'red'}}>Comment cannot be empty!</Text>
                </Animatable.View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{margin: 10}}>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      backgroundColor: '#28242A',
                    }}
                    onPress={() => {
                      setModalComment(!modalComment);
                    }}>
                    <Icon name="ios-close" size={35} color="white" />
                  </TouchableHighlight>
                </View>
                <View style={{margin: 10}}>
                  <TouchableHighlight
                    onPress={() => submitComment(idScream, comment)}
                    style={{
                      ...styles.openButton,
                      backgroundColor: '#28242A',
                      paddingTop: 4,
                    }}>
                    <Icon name="ios-paper-plane" size={25} color="#BE945B" />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  screamContainer: {
    width: 175,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  img: {
    width: 100,
    height: 100,
  },
  darkThemeComment: {
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28242A',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  lightThemeComment: {
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  darkTheme: {
    width: 350,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28242A',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  lightTheme: {
    width: 350,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  lightThemeTx: {
    color: 'black',
    paddingBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  darkThemeTx: {
    color: '#fff',
    paddingBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default HomeScreen;
