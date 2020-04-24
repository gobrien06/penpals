import * as React from 'react';
import { Image, TextInput, StyleSheet, View, Dimensions, TouchableHighlight, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HomeButton from '../components/HomeButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LinearGradient} from 'expo-linear-gradient';

import axios from 'axios';


export default function SignupScreen(props) {
    const [usernm,setUser] = React.useState(null);
    const [password,setPassword] = React.useState(null);
    const [phone,setPhone] = React.useState(null);
    const [error, setError] = React.useState('');
    const [fullName,setFullName] = React.useState(['first','last']);
 

    const submitInfo =  async() => {
      const user={
        username:usernm,
        password:password,
        phone:phone,
        name:fullName[0],
      }
      //console.log(user);
      if(!usernm || !password || !phone){
        setError('Missing a field. Please enter all fields before continuing.');
        return;
      }
      await axios.post('http://lahacks-hobbyist.tech:3000/users',user)
      .then((response)=>{
          props.route.params.setTOKEN(response.data.token);
          
        })
      .catch(()=>{
        setError("Network error. Try again.")
      })
      console.log("sent");
      props.navigation.navigate('Hobbies');
    }

    return (
        <View style={styles.container}>
          <KeyboardAwareScrollView style={{flexGrow:1,}} enableAutomaticScroll="true" extraScrollHeight={200} enableOnAndroid={true}  >

         
            <Text style={styles.midText}>
            Let's start.
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
            onChangeText={(text) => setUser(text)}/>

            <View style={{flexDirection: 'row',flexWrap: 'wrap', alignItems: 'flex-start',}}>          
            <TextInput
            secureTextEntry={false}
            placeholder="First"
            style={styles.textInputName}
            onChangeText={(text) => setFullName((fullName)=>{fullName[0] = text})}
            />
             <TextInput
            secureTextEntry={false}
            placeholder="Last"
            style={styles.textInputName}
            onChangeText={(text) => setFullName((fullName)=>{fullName[1] = text})}
            /> 
            </View>
                
            <TextInput
            secureTextEntry={true}
            placeholder="Password"
            style={styles.textInput}
            onChangeText={(text) => setPassword(text)}
            />
            <TextInput
            secureTextEntry={false}
            placeholder="Phone"
            style={styles.textInput}
            onChangeText={(text) => setPhone(text)}
            />
            <View style={{height:20}}/>
            <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 70, width: 230,  borderRadius:50, alignItems: 'center', justifyContent: 'center',}}
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

var widthVal = Dimensions.get('window').width; 

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
        marginTop:50,   
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
        color:`#FF7D00`,
        margin:20,
        padding:10,
        fontSize:25,
        width:300,
        height:70,
        borderRadius:5,
      },
      textInputName:{
        backgroundColor:`#F4F4F4`,
        color:`#FF7D00`,
        margin:10,
        padding:10,
        fontSize:25,
        width:140,
        height:70,
        borderRadius:5,
      },
      buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center', 
        margin:20,
      }
});