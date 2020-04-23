import * as React from 'react';
import { Image, TextInput, StyleSheet, View, Dimensions, TouchableHighlight, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HomeButton from '../../../Hobbyist/components/HomeButton';
import axios from 'axios';

export default function LogIn(props) {
    const [usernm,setUserNM] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [error, setError] = React.useState(null);

    const submitInfo = async() => {
      let success = false;
      const user={
        username:usernm,
        password:password,
      }
      //console.log(user);
      if(!usernm || !password){
        setError('Missing a field. Please enter all fields before continuing.');
        return;
      }
     await axios.post('http://lahacks-hobbyist.tech:3000/auth',user)
      .then((response)=>{
          props.route.params.setTOKEN(response.data.token);
          if(response.status == 200){
            success=true;
          }
       
        })
      .catch(()=>{
        setError('Network error. Please try again.');
      })

      if(!success){
        setError("Credentials incorrect. Please try again.")
        return;
      }
        props.setUser(usernm);
        props.navigation.navigate('SearchSetup');
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{flexGrow:1,}} enableAutomaticScroll="true" extraScrollHeight={100} enableOnAndroid={true}  >
             
            <View>
              <Image
              source={
                require('../assets/images/iu.png')
              }
              style={styles.headerImage}
              />
        
            <HomeButton navigation={props.navigation}  />

            </View>

         
            <Text style={styles.midText}>
              Welcome.
            </Text>

            <View style={styles.buttonContainer}>
            <TextInput
            secureTextEntry={false}
            placeholder="Username"
            style={styles.textInput}
            onChangeText={(text) => setUserNM(text)}
            />
            
            
            <TextInput
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            style={styles.textInput}/>
            <TouchableHighlight style={styles.touchStyle} onPress={()=>submitInfo()} >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableHighlight>
            </View>
            <Text style={styles.errorText}>
            {error}
            </Text>
        
            </KeyboardAwareScrollView>
        </View>
      );
}

var widthVal = Dimensions.get('window').width; 

const styles = StyleSheet.create({
    errorText:{
      elevation:1,
      margin:10,
      padding:20,
      fontSize:20,
      color:`#fff`,
    },
    container: {
        flex: 1,
        backgroundColor: '#202020',
    },
    headerImage:{

        borderBottomRightRadius:75,
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
        marginLeft:10,
        fontSize:78,
      
        fontFamily:'Nunito',
          fontWeight:`bold`,
        marginTop:-80,

        textAlign:`left`,
        color:`#202020`,
    },
    touchStyle:{
        
      borderRadius:50,
      
      alignItems:`center`,
      justifyContent:`center`,
      padding:5,
      width:200,
  
      height:60,
        marginTop:20,
     
        backgroundColor:`#FAE99E`,

        alignItems:`center`,
        justifyContent:`center`,

      },
      buttonText:{
        fontSize:25,
 
        color:`#202020`,
      },
      bottomBubble:{
        alignSelf:`flex-end`,
        marginTop:-140,
      },
      textInput:{
          margin:10,
          padding:10,
          backgroundColor:`#1A1A1A`,
          color:`#47CEB2`,
          fontSize:25,
          width:300,
          height:75,
          borderRadius:10,
      },
      buttonContainer:{
    
            alignItems: 'center',
            justifyContent: 'center', 
          marginTop:30,
      }
});