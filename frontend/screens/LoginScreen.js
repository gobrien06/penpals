import * as React from 'react';
import {  TextInput, StyleSheet, View, Dimensions, TouchableHighlight, Text, ActivityIndicator} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HomeButton from '../../frontend/components/HomeButton';
import {LinearGradient} from 'expo-linear-gradient';
import axios from 'axios';

export default function LogIn(props) {
    const [usernm,setUserNM] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    var source;
    const CancelToken = axios.CancelToken;
    source = CancelToken.source();

    const submitInfo = () => {
      setLoading(true);
      const user={
        username:usernm,
        password:password,
      }
      //console.log(user);
      if(!usernm || !password){
        setError('Missing a field. Please enter all fields before continuing.');
        setLoading(false);
        return;
      }
      axios.post('http://104.154.57.17:3000/auth',user, {cancelToken:source.token})
      .then((response)=>{
          props.route.params.setTOKEN(response.data.token);
          props.setUser(usernm);
          props.navigation.navigate('Home');
          setSuccess(response.status);
        })
      .catch((error)=>{
        console.log(error);
        setError('Network error. Please try again.');
      })
      if(success !=='200'){
        setError('Incorrect credentials. Please retry.');
      }
      setError('');
      setLoading(false);
    }

    return (
      
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{flexGrow:1,}} enableAutomaticScroll={true} extraScrollHeight={100} enableOnAndroid={true}  >
            
            <Text style={styles.midText}>
              Login. 
            </Text>
            <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 2.5, width: 325,}}
           />

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
            <View style={{height:40,}}/>
            {loading && <ActivityIndicator size="large" style={{marginBottom:20}} color='#FDB372'/>}
            <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 65, width: 225,  borderRadius:50, alignItems: 'center', justifyContent: 'center',}}
            >
            <TouchableHighlight style={styles.touchStyle} onPress={()=>submitInfo()} >
              <Text style={styles.buttonText}>Continue</Text>
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

var widthVal = Dimensions.get('window').width; 

const styles = StyleSheet.create({
    errorText:{
      elevation:1,
      marginLeft:40,
      marginTop:-20,
      padding:20,
      fontSize:20,
      color:`grey`,
      fontFamily:`manrope`,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    midText:{
      marginLeft:20,
      fontSize:60,
      fontFamily:'manrope-semi-bold',
      marginTop:40,
      textAlign:`left`,
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
        marginTop:-140,
      },
      textInput:{
        margin:20,
        padding:10,
        backgroundColor:`#F4F4F4`,
        color:`#000`,
        fontSize:25,
        width:300,
        height:75,
        borderRadius:15,
      },
      buttonContainer:{
        alignItems: 'center',
        justifyContent: 'center', 
        margin:40,
      }
});