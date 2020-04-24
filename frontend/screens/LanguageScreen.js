import * as React from 'react';
import { TextInput, StyleSheet, View, TouchableHighlight, Text, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import {LinearGradient} from 'expo-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function SignupScreen(props) {
  const [languages, setLanguages] = React.useState([]);
  const [formValue,setFormValue] = React.useState('');
  const [error,setError] = React.useState('');
  const [editing, setEdit] = React.useState(false);
  const [coords, setCoords] = React.useState(['','']);
  const [loading, setLoading] = React.useState(false);
  var source;
  const CancelToken = axios.CancelToken;
  source = CancelToken.source();

  const textInput = React.createRef ();
  
  const submitInfo = () => {
    setLoading(true);
    setLanguages(languages => {
      if(formValue=='')
        return languages;

        languages.push(formValue);
        return languages;
    });
        //console.log("submitted");
        setFormValue('');
        setLoading(false);
        textInput.current.clear();
  }

  const findLoc = () =>{
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            JSON.stringify(position);
            console.log(position.coords);
            setCoords([position.coords.latitude,position.coords.longitude]);
        },
        (error) =>{
            console.log(error.message);
            Alert.alert(error.message);
        }
        
    )
    setLoading(false);
    /*
    Geocoder.from(coords[0],coords[1])
    .then((geocoded)=>{
        let results = geocoded.results[0].address_components[0];
        console.log(results);
        setLoc(results);
    })
    .catch((error)=>{
        console.log(error);
    })*/
  }

  const sendItems = () =>{
    setLoading(true);
    const config={
      headers: {
        'Authorization': 'BEARER ' + props.route.params.TOKEN,
      }
    }
    const user={
      language:languages,
      location:coords,
    }
    if(languages===[]){
      setError('You have no languages!');
      setLoading(false);
      return;
    }

    axios.post('http://104.154.17:3000/users/update',user,config)
    .then((response)=>{
        console.log(response);
      })
    .catch(()=>{
      setError('Network error. Please try again.');
    })
    setLoading(false);
    props.navigation.navigate('Home');
    source.cancel('Left page, request canceled.');
  }

  const getInitial= ()=>{
    setLoading(true);

    const config={
      headers: {
        'Authorization': 'BEARER ' + props.route.params.TOKEN,
      }
    }
    
      axios.get('http://104.157.57.17:3000/users/language',config, {cancelToken:source.token})
    .then((response)=>{
      if(response.data.language){
        setLanguages(response.data.language);
        setLocation(response.data.location);
      }
    })
    .catch(()=>{
      setError('Network error. Could not fetch languages.');
    })
    setLoading(false);
  }
  

  React.useEffect(getInitial);  
  

  const generateItem = () =>{
        return (languages.map((item, index)=>{
            return (
            <View style={styles.languageItem}>
            <Text style={styles.languageText}>{item}</Text>
            <TouchableHighlight onPress={() => handleRemove(index)}  style={styles.removeButton}><Text style={styles.closeText}>x</Text></TouchableHighlight>
            </View>
          
            )
        })
        )
       
      }  

  const handleRemove=(i)=>{
    console.log("removing");
    setLanguages((languages) => {
        let old = [...languages];
        old.splice(i,1);
        return old;
    });
  }

  var coordsStr = "("+Math.trunc(coords[0])+","+Math.trunc(coords[1])+")";
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
            <Text style={styles.settingTxt}>Location:<Text style={{fontSize:20,}}>  {coords && coordsStr}  </Text> </Text>
            <TouchableHighlight style={styles.editBtn} onPress={()=>findLoc()}>
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
            autoCorrect={true}
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
            {loading && <ActivityIndicator size="large" style={{marginBottom:10}} color='#FDB372'/>}
            <View style={{height:30}}/>
            <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 65, width: 205,  borderRadius:50, alignItems: 'center', justifyContent: 'center',}}
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
      height:360,
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
      paddingLeft:65,
    },
    languageItem:{ 
      elevation:5,
      alignItems:`center`,
      justifyContent:`center`,
      backgroundColor:`#FFF`,
      height: 50,
      width: 230,
      marginTop:20,
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
        marginTop:40,
        fontFamily:'manrope-semi-bold',
        textAlign:`center`,
    },
    touchStyle:{
      borderRadius:50,
      alignItems:`center`,
      backgroundColor:`#FFF`,
      justifyContent:`center`,
      padding:5,
      width:200,
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
        elevation:5,
        height: 40,
        width: 70,
        alignItems:`center`,
        justifyContent:`center`,
        backgroundColor:`#FFF`,
        borderRadius:10,
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
          color:`#FF7D00`,
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