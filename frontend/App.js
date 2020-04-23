import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View,Text } from 'react-native';
import * as Font from 'expo-font';

import { SplashScreen } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';



import useLinking from './navigation/useLinking';



const Stack = createStackNavigator();


export default function App(props) {
  Font.loadAsync({
    'nunito-extra-bold':require('./assets/fonts/Nunito-ExtraBold.ttf'),
    'Nunito':require('./assets/fonts/Nunito-Regular.ttf'),
    'nunito-light':require('./assets/fonts/Nunito-Light.ttf'),
    'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
  });
  

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const [TOKEN, setTOKEN] = React.useState(null);
  const [username, setUser] = React.useState('');

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator screenOptions={{headerShown: false,}}>
            <Stack.Screen name="Home">
            {props => <HomeScreen {...props} TOKEN={TOKEN} setTOKEN={setTOKEN}/>}
            </Stack.Screen> 
          
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


