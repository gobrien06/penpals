import * as React from 'react';
import { Image, TextInput, StyleSheet, View, Dimensions, TouchableHighlight, Text, ScrollView } from 'react-native';
import HomeButton from '../components/HomeButton';
import axios from 'axios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function SignupScreen(props) {
  const [hobbies, setHobbies] = React.useState([]);
  const [formValue,setFormValue] = React.useState('');
  const [error,setError] = React.useState('');
  const textInput = React.createRef();
  
  const submitInfo = () => {
    setHobbies(hobbies => {
      if(formValue=='')
        return hobbies;

        let old = [...hobbies];
        old.push(formValue);
        return old;
    });
        //console.log("submitted");
        setFormValue('');
        textInput.current.clear();
  }

  const sendItems = async() =>{
    console.log("sending");
    const config={
      headers: {
        'Authorization': 'BEARER ' + props.TOKEN,
      }
    }
    const user={
      hobby:hobbies,
    }
    if(hobbies===[]){
      setError('You have no hobbies!');
      return;
    }

    await axios.post('http://lahacks-hobbyist.tech:3000/users/update',user,config)
    .then((response)=>{
        console.log(response);
      })
    .catch(()=>{
      setError('Network error. Please try again.');
    })
  
    props.navigation.navigate('SearchSetup');
  }

  const getInitial= async()=>{
    const config={
      headers: {
        'Authorization': 'BEARER ' + props.TOKEN,
      }
    }
    
     await axios.get('http://lahacks-hobbyist.tech:3000/users/hobby',config)
    .then((response)=>{
      if(response.data.language){
        setLanguages(response.data.language);
      }
     
    })
    .catch(()=>{
      setError('Network error. Could not fetch languages.');
    })
  }

  React.useEffect(()=>
    {
      getInitial();
    },[]
  )

  const generateItem = () =>{
      
        let items = languages.map((item)=>{
            <View style={styles.hobbyItem}>
            <Text style={styles.hobbyText}>{item}</Text>
            <TouchableHighlight onPress={() => handleRemove(i)}  style={styles.removeButton}><Text style={styles.closeText}>x</Text></TouchableHighlight>
            </View>
        })
         
         
      }
      //sendItems();
      return items;
  }

  const handleRemove=(i)=>{
    console.log("removing");
    setHobbies(hobbies => {
        let old = [...hobbies];
        old.splice(i,1);
        return old;
    });
  }

  
    return (
        <View style={styles.container}>
          <KeyboardAwareScrollView style={{}}   scrollEnabled={false} extraScrollHeight={130} enableOnAndroid={true} enableResetScrollToCoords={true}>
            <View>
            <Image
                source={
                  require('../assets/images/oc-1.png')
                }
                style={styles.headerImage}
              />
        
            <HomeButton navigation={props.navigation}/>
           

            </View>

         
            <Text style={styles.midText}>
            Hobbies.
            </Text>

            <View style={styles.midHold}>
            <ScrollView contentContainerStyle={styles.hobbiesHolder} >
            {generateItem()}
            </ScrollView>
            </View>
          

            <View style={styles.buttonContainer}>
            <TextInput
            secureTextEntry={false}
            placeholderTextColor = "#151616"
            placeholder="Type Another"
            onChangeText={(text) => setFormValue(text)}
            onSubmitEditing={submitInfo}
            autoCapitalize="words"
            ref={textInput}
            style={styles.textInput}/>

            <TouchableHighlight style={styles.touchStyle} onPress={()=>sendItems()} >
              <Text style={styles.buttonText}>></Text>
            </TouchableHighlight>
            </View>
            <Text style={styles.errorText}>
            {error}
            </Text>
                
            </KeyboardAwareScrollView>
        </View>
      );
}

var widthVal = Dimensions.get('window').width + 10; 

const styles = StyleSheet.create({
  errorText:{
    padding:10,
    fontSize:10,
    color:`#fff`,
  },
    closeText:{
      fontFamily:'manrope',
      color:`#FFF`,
      fontSize:30,
      top:0,
 
    },
    midHold:{
      height:280, 
      marginTop:15,
      
      
    },
    removeButton:{
      alignSelf:`flex-end`,
      paddingRight:10,
      marginTop:-40,
    },
    languageText:{
      fontFamily:'manrope',
      color:`#FFF`,
      fontSize:25,
      textAlign:`center`,
    },
    hobbiesHolder:{
      justifyContent:`center`,
      alignContent:`center`,
      padding:20,
      paddingLeft:83,
    },
    hobbyItem:{
      
      alignItems:`center`,
      justifyContent:`center`,
      backgroundColor:`#1A1A1A`,
      height: 70,
      width: 230,
      margin:8,
      borderRadius: 10,
      borderWidth:3,
      borderColor:'#47CEB2',
    },
    container: {
      flex:1,
        backgroundColor: '#202020',
    },
    headerImage:{
  
      
      elevation: -1,
      width:widthVal,
      height:245,
      marginTop:-80,
      backgroundColor:`#47CEB2`,
    },
    headerBubbles:{
        width:100,
        height:120,
        position:`absolute`,
        marginTop:0,
    },
    midText:{
        fontSize:80,
        marginTop:-83,
        fontFamily:'Nunito',
        fontWeight:`bold`,
        textAlign:`center`,
        color:`#202020`,
    },
    touchStyle:{
      marginTop:20,
      marginBottom:30,
      borderRadius:50,
      alignItems:`center`,
      backgroundColor:`#FAE99E`,
      justifyContent:`center`,
      padding:5,
      width:70,
      height:70,
    },
      buttonText:{
        fontSize:30,
        fontFamily:'Nunito',
        fontWeight:`bold`,
        color:`#202020`,
      },
      bottomBubble:{
        elevation:-1,
        alignSelf:`flex-end`,
        marginTop:-120,
      },
      textInput:{
          margin:0,
          fontFamily:'Nunito',
          marginTop:0,
          padding:10,
          backgroundColor:`#47CEB2`,
          color:`#151616`,
          fontSize:25,
          width:300,
          height:65,
          borderRadius:10,
          textAlign:`center`,
      },
      buttonContainer:{
            alignItems: 'center',
            justifyContent: 'center', 
          marginTop:30,
      }
});