import * as React from 'react';
import { Image, TextInput, StyleSheet, View, Dimensions, TouchableHighlight, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HomeButton from '../components/HomeButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

export default function SignupScreen(props) {
    const [usernm,setUser] = React.useState(null);
    const [password,setPassword] = React.useState(null);
    const [phone,setPhone] = React.useState(null);
    const [error, setError] = React.useState('');
 

    const submitInfo =  async() => {
      const user={
        username:usernm,
        password:password,
        phone:phone,
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

            <View>
            <Image
                source={
                  require('../assets/images/oc-1.png')
                }
                style={styles.headerImage}
              />
        

               
            <HomeButton navigation={props.navigation}  />

            </View>

         
            <Text style={styles.midText}>
            Let's start.
            </Text>

            <View style={styles.buttonContainer}>
            <TextInput
            secureTextEntry={false}
            placeholder="Username"
            style={styles.textInput}
            onChangeText={(text) => setUser(text)}/>
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
            <TouchableHighlight style={styles.touchStyle} onPress={()=>submitInfo()} >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableHighlight>
            <Text style={styles.errorText}>
            {error}
            </Text>
            </View>
            <Image
                source={
                    require('../assets/images/bubblesgrey.png')
                }
                style={styles.bottomBubble}
            />
                 </KeyboardAwareScrollView>
        </View>
      );
}

var widthVal = Dimensions.get('window').width; 

const styles = StyleSheet.create({
    errorText:{
      elevation:2,
      margin:10,
      marginTop:-30,
      padding:20,
      fontSize:20,
      color:`#fff`,
    },
    container: {
        flex: 1,


        backgroundColor: '#202020',
     
        
    },
    headerImage:{
   
      borderBottomLeftRadius:75,
        width:widthVal,
        height:500,
        marginTop:-240,
        backgroundColor:`rgba(71, 206, 178, 0.4)`,
   
    },
    headerBubbles:{
        width:100,
        height:120,
        position:`absolute`,
        marginTop:25,
    },
    midText:{
        fontSize:75,
        marginTop:-79,
        fontFamily:'Nunito',
        fontWeight:`bold`,
        textAlign:`right`,
        color:`#202020`,
    },
    touchStyle:{
        marginTop:20,
        marginBottom:30,
        backgroundColor:`#FAE99E`,
        borderRadius:50,
        alignItems:`center`,
        justifyContent:`center`,
        padding:5,
        width:200,
        height:60,
      },
      buttonText:{
        fontSize:25,
        fontWeight:`bold`,
        color:`#202020`,
      },
      bottomBubble:{
        alignSelf:`flex-end`,
        marginTop:-170,
      },
      textInput:{
          margin:10,
          padding:10,
          backgroundColor:`#1A1A1A`,
          color:`#47CEB2`,
          fontSize:25,
          width:300,
          height:70,
          borderRadius:10,
      },
      buttonContainer:{
            alignItems: 'center',
            justifyContent: 'center', 
          marginTop:5,
      }
});