import {useTheme} from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import {Button, Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

const HomeScreen = ({navigation}) => {
  const [screams, setScreams] = React.useState();
  dayjs.extend(relativeTime);

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
    getAllScreams();
  }, []);

  const theme = useTheme();

  const Item = ({body, createdAt, userHandle, image, styleBC, styleTx}) => {
    return (
      <View style={styleBC}>
        <View style={{flex: 2}}>
          <Image source={{uri: image}} style={styles.img} resizeMode="cover" />
        </View>
        <View style={styles.screamContainer}>
          <Text style={{color: '#BE945B', paddingBottom: 2}}>{userHandle}</Text>
          <Text style={styleTx}>{body}</Text>
          <Text style={{color: '#95864D'}}>{dayjs(createdAt).fromNow()}</Text>
        </View>
      </View>
    );
  };

  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <SafeAreaView>
        <FlatList
          data={screams}
          renderItem={({item}) => (
            console.log(item.userImage),
            (
              <Item
                styleBC={theme.dark ? styles.lightTheme : styles.darkTheme}
                styleTx={theme.dark ? styles.lightThemeTx : styles.darkThemeTx}
                userHandle={item.userHandle}
                body={item.body}
                createdAt={item.createdAt}
                image={item.userImage}
              />
            )
          )}
          keyExtractor={item => item.screamId}
        />
        <Button
          title="Go to Details screen"
          onPress={() => navigation.navigate('Details')}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  screamContainer: {
    flex: 3,
  },
  img: {
    width: 100,
    height: 100,
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
  },
  darkThemeTx: {
    color: '#fff',
    paddingBottom: 2,
  },
});

export default HomeScreen;
