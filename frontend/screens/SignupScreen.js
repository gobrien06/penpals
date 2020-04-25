import * as React from 'react';
import { Image, TextInput, StyleSheet, View, Dimensions, TouchableHighlight, Text, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HomeButton from '../components/HomeButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LinearGradient} from 'expo-linear-gradient';

import axios from 'axios';


export default function SignupScreen(props) {
    const [usernm,setUser] = React.useState(null);
    const [password,setPassword] = React.useState(null);
    const [error, setError] = React.useState('');
    const [firstName,setFirstName] = React.useState('');
    const [lastName,setLastName] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [coords, setCoords] = React.useState(['','']);

    const findLoc = () =>{
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
          (position) => {
              JSON.stringify(position);
              console.log(position.coords);
              setCoords([parseFloat(position.coords.latitude),parseFloat(position.coords.longitude)]);
          },
          (error) =>{
              console.log(error.message);
              Alert.alert(error.message);
          }
      )
      setLoading(false);
    }
  
    const submitInfo =  () => {
      setLoading(true);
      findLoc();
      const user={
        username:usernm,
        password:password,
        name:[firstName,lastName],  
        coords:coords,
      }
      if(!usernm || !password || !firstName || !lastName){
        setError('Missing a field. Please enter all fields before continuing.');
        setLoading(false);
        return;
      }
      axios.post('http://104.154.57.17:3000/users',user, {timeout: 500})
      .then((response)=>{
          props.route.params.setTOKEN(response.data.token);
          props.navigation.navigate('Language', {TOKEN:response.data.token});
        })
      .catch((error)=>{
        console.log(error);
        setError("Network error. Try again.")
      })
      setLoading(false);
    
    }

    return (
        <View style={styles.container}>
          <KeyboardAwareScrollView style={{flexGrow:1,}} enableAutomaticScroll={true} extraScrollHeight={200} enableOnAndroid={true}  >
            <Text style={styles.midText}>
            Register.
            </Text>
            <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 2.5, width: 325,alignSelf: 'flex-end'}}
           />

            <View style={styles.buttonContainer}>
            <TextInput
            secureTextEntry={false}
            placeholder="Username"
            style={styles.textInput}
            onChangeText={(text) => {setUser(text);props.setUser(text)}}/>

            <View style={{flexDirection: 'row',flexWrap: 'wrap', alignItems: 'flex-start',}}>          
            <TextInput
            secureTextEntry={false}
            placeholder="First"
            style={styles.textInputName}
            onChangeText={(text) => setFirstName((text))}
            />
             <TextInput
            secureTextEntry={false}
            placeholder="Last"
            style={styles.textInputName}
            onChangeText={(text) => setLastName(text)}
            /> 
            </View>
                
            <TextInput
            secureTextEntry={true}
            placeholder="Password"
            style={styles.textInput}
            onChangeText={(text) => setPassword(text)}
            />
       
            <View style={{height:20}}/>
            {loading && <ActivityIndicator size="large"  style={{marginBottom:15}} color='#FDB372'/>}
            <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 65, width: 225,  borderRadius:50, alignItems: 'center', justifyContent: 'center', marginTop:25}}
            >
            <TouchableHighlight style={styles.touchStyle} onPress={()=>submitInfo()} >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableHighlight>
            </LinearGradient>

            <Text style={styles.errorText}>
            {error}
            </Text>
            </View>
            </KeyboardAwareScrollView>
        </View>
      );
}


const styles = StyleSheet.create({
    errorText:{
      elevation:1,
      marginLeft:10,
      padding:20,
      fontSize:20,
      color:`grey`,
      fontFamily:`manrope`,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',    
    },
    headerBubbles:{
        width:100,
        height:120,
        position:`absolute`,
        marginTop:25,
    },
    midText:{
        marginRight:20,
        fontSize:60,
        fontFamily:'manrope-semi-bold',
        marginTop:40,   
        textAlign:`right`,
        color:`#000`,
    },
    touchStyle:{
      borderRadius:50,
      alignItems:`center`,
      justifyContent:`center`,
      padding:5,
      width:220,
      height:60,
      backgroundColor:`#FFF`,
      alignItems:`center`,
      justifyContent:`center`,
      },
      buttonText:{
        fontSize:25,
        color:`#FF3D00`,
      },
      bottomBubble:{
        alignSelf:`flex-end`,
        marginTop:-170,
      },
      textInput:{
        backgroundColor:`#F4F4F4`,
        color:`#000`,
        margin:20,
        padding:10,
        fontSize:25,
        width:300,
        height:70,
        borderRadius:15,
      },
      textInputName:{
        backgroundColor:`#F4F4F4`,
        color:`#000`,
        margin:10,
        padding:10,
        fontSize:25,
        width:140,
        height:70,
        borderRadius:15,
      },
      buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center', 
        marginTop:30,
        margin:20,
      }
});