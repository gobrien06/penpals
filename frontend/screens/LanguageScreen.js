import * as React from 'react';
import { TextInput, StyleSheet, View, Dimensions, TouchableHighlight, Text, ScrollView } from 'react-native';
import HomeButton from '../components/HomeButton';
import axios from 'axios';
import {LinearGradient} from 'expo-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function SignupScreen(props) {
  const [languages, setLanguages] = React.useState([]);
  const [formValue,setFormValue] = React.useState('');
  const [error,setError] = React.useState('');
  const [editing, setEdit] = React.useState(false);

  const textInput = React.createRef();
  
  const submitInfo = () => {
    setLanguages(languages => {
      if(formValue=='')
        return languages;

        languages.push(formValue);
        return languages;
    });
        //console.log("submitted");
        setFormValue('');
        textInput.current.clear();
  }

  const sendItems = async() =>{
    /*onsole.log("sending");
    const config={
      headers: {
        'Authorization': 'BEARER ' + props.TOKEN,
      }
    }
    const user={
      language:languages,
    }
    if(languages===[]){
      setError('You have no languages!');
      return;
    }

    await axios.post('http://lahacks-hobbyist.tech:3000/users/update',user,config)
    .then((response)=>{
        console.log(response);
      })
    .catch(()=>{
      setError('Network error. Please try again.');
    })
  
    //props.navigation.navigate('Search');*/
  }

  const getInitial= async()=>{
    /*const config={
      headers: {
        'Authorization': 'BEARER ' + props.TOKEN,
      }
    }
    
     await axios.get('http://lahacks-hobbyist.tech:3000/users/language',config)
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
  )*/
  }

  const generateItem = () =>{
        return (languages.map((item, index)=>{
            return (
            <LinearGradient
            colors={['#FF8800','#FF7400',  '#FF7A00', '#FF5300', '#FF2100', '#FF3C00']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 55, width: 235, borderRadius:10, alignItems: 'center', justifyContent: 'center', margin:5,}}
            >
            <View style={styles.languageItem}>
            <Text style={styles.languageText}>{item}</Text>
            <TouchableHighlight onPress={() => handleRemove(index)}  style={styles.removeButton}><Text style={styles.closeText}>x</Text></TouchableHighlight>
            </View>
            </LinearGradient>
            )
        })
        )
       
      }
      //sendItems();
  

  const handleRemove=(i)=>{
    console.log("removing");
    setLanguages((languages) => {
        let old = [...languages];
        old.splice(i,1);
        return old;
    });
  }

  var widthVal = Dimensions.get('window').width; 

    return (
        <View style={styles.container}>
          <KeyboardAwareScrollView style={{}}   scrollEnabled={false} extraScrollHeight={130} enableOnAndroid={true} enableResetScrollToCoords={true}>

            <Text style={styles.midText}>
            Settings.
            </Text>

            <View style={{flexDirection: 'row',flexWrap: 'wrap', alignItems: 'flex-start', marginTop:5, marginBottom:10}}>
            <View style={{width:110}}/>
            <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 2, width: 180,  borderRadius:50, alignItems: 'center', justifyContent: 'center',}}
            />         
            </View>

            <View style={styles.midHold}>
            <View style={{flexDirection: 'row',flexWrap: 'wrap', alignItems: 'flex-start',}}>
            <Text style={styles.settingTxt}>Location: {props.location}  </Text>
            <TouchableHighlight style={styles.editBtn} onPress={()=>props.setLoc()}>
            <Text style={styles.smallbuttonText}>Find</Text>
            </TouchableHighlight>
            </View>
            <View style={{flexDirection: 'row',flexWrap: 'wrap', alignItems: 'flex-start',}}>
            <Text style={styles.settingTxt}>Languages:</Text> 
            { editing ? <View/> 
            :
            <View>
            <TouchableHighlight style={styles.editBtn} onPress={()=>setEdit(true)}>
            <Text style={styles.smallbuttonText}>Edit</Text>
            </TouchableHighlight>
            </View>
            }   
            </View>

            <ScrollView contentContainerStyle={styles.languagesHolder} >
            {generateItem()}
            </ScrollView>
            </View>

          

            <View style={styles.buttonContainer}>
            { editing ? (
            <View>
            <TextInput
            secureTextEntry={false}
            placeholderTextColor = "#151616"
            placeholder="Type Another"
            onChangeText={(text) => setFormValue(text)}
            onSubmitEditing={submitInfo}
            autoCapitalize="words"
            ref={textInput}
            style={styles.textInput}/>
            <View style={{flexDirection: 'row',flexWrap: 'wrap', alignItems: 'flex-start',}}>
            <View style={{width:105,}}/>
            <TouchableHighlight style={styles.editBtn} onPress={()=>setEdit(false)}>
            <Text style={styles.smallbuttonText}>X</Text>
            </TouchableHighlight>
            </View>
            </View> )
            : (<View/>)}   
            <View style={{height:30}}/>
            <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 70, width: 230,  borderRadius:50, alignItems: 'center', justifyContent: 'center',}}
            >
            <TouchableHighlight style={styles.touchStyle} onPress={()=>sendItems()} >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableHighlight>
            </LinearGradient>
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
        elevation:1,
        marginLeft:50,
        marginTop:-15,
        padding:20,
        fontSize:20,
        color:`grey`,
        fontFamily:`manrope`,
      },
    closeText:{
      fontFamily:'manrope',
      color:`#000`,
      fontSize:30,
      top:0,
    },
    midHold:{
      height:400,
      margin:20, 
      marginTop:0, 
    },
    removeButton:{
      alignSelf:`flex-end`,
      paddingRight:10,
      marginTop:-40,
    },
    languageText:{
      fontFamily:'manrope',
      color:`#FF7D00`,
      fontSize:25,
      textAlign:`center`,
    },
    languagesHolder:{
      justifyContent:`center`,
      alignContent:`center`,
      padding:10,
      paddingLeft:30,
    },
    languageItem:{     
      alignItems:`center`,
      justifyContent:`center`,
      backgroundColor:`#FFF`,
      height: 50,
      width: 230,
      padding:8,
      borderRadius: 10,
    
    },
    container: {
      flex:1,
        backgroundColor: '#FFF',
    },
    headerBubbles:{
        width:100,
        height:120,
        position:`absolute`,
        marginTop:0,
    },
    midText:{
        fontSize:60,
        marginTop:20,
        fontFamily:'manrope-semi-bold',
        textAlign:`center`,
    },
    touchStyle:{
      borderRadius:50,
      alignItems:`center`,
      backgroundColor:`#FFF`,
      justifyContent:`center`,
      padding:5,
      width:220,
      height:60,
    },
      buttonText:{
        fontSize:25,
        fontFamily:'manrope',
        color:`#FF3D00`,
        textAlign:`center`,
        
      },
      smallbuttonText:{
        fontSize:25,
        fontFamily:'manrope-light',
        color:`#000`,
        textAlign:`center`,
      },
      editBtn:{
        height: 40,
        width: 70,
        alignItems:`center`,
        justifyContent:`center`,
        backgroundColor:`#FFF`,
        borderRadius:10,
        borderColor:`#000`,
        borderWidth:1,
        margin:10,
        marginTop:25,
      },
      settingTxt:{
          marginTop:20,
          color:`#000`,
          fontSize:35,
          fontFamily:'manrope',
      },
      bottomBubble:{
        elevation:-1,
        alignSelf:`flex-end`,
        marginTop:-120,
      },
      textInput:{
          margin:0,
          fontFamily:'manrope',
          marginTop:0,
          padding:10,
          borderColor:'#000',
          backgroundColor:`#FFF`,
          color:`#FF3D00`,
          fontSize:25,
          width:300,
          height:70,
          borderWidth:1,
          borderRadius:10,
          textAlign:`center`,
      },
      buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center', 
        textAlign:`center`,
      },
});