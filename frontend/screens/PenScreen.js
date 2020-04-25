import * as React from 'react';
import {View,Text,TextInput, TouchableHighlight, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import moment from 'moment';

export default function PenScreen(props){
    const username = props.route.params.user;
    const [message, setMessage] = React.useState({});
    const [formValue, setFormValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [sentText, setSent] = React.useState('');
    const currentDate = moment().format("MM/DD/YYYY HH:mm");

    var source;
    const CancelToken = axios.CancelToken;
    source = CancelToken.source();
    const textInput = React.createRef();

    const submitInfo =   (e) => {
        e.preventDefault();

        if(formValue === '')
            return;

        sendMessage(formValue);
        setFormValue('');
        textInput.current.clear();
      }

    const sendMessage=(text)=>{ 
        setLoading(true);
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }

        const message ={
           content:{
            message:text,
            username:username,
            date: currentDate,
           },
           channelId: props.route.params.channelId,  
        }
        axios.post('http://104.154.57.17:3000/chat/channels/send', message,config, {cancelToken:source.token})
        .then((response)=>{
            setSent('Sent!');
        })
        .catch((error)=>{
            console.log(error);
        })
        setLoading(false);
    }

    const goHome = () => {
        source.cancel('Leaving page. Canceling request');
        props.navigation.navigate("Chat");
    }
    const txt = '>';

    return (
    <View style={styles.container}>
    <KeyboardAwareScrollView style={{}} scrollEnabled={false} extraScrollHeight={70} enableOnAndroid={true} enableResetScrollToCoords={true}>
    <View style={styles.topBar}>
    <Text style={styles.topText}>
    {props.route.params.user}
    </Text>
    <TouchableHighlight onPress={() => goHome()} style={styles.iconButton}>   
    <Text style={{textAlign:`center`,fontSize:45,fontFamily:`manrope-bold`,color:`#FF7D00`}}>
        {txt}
    </Text>        
    </TouchableHighlight>
    </View>
    <View style={{}}>
    <TextInput 
     secureTextEntry={false}
     placeholderTextColor = "#151616"
     placeholder="Type Another"
     onChangeText={(text) => setFormValue(text)}
     onSubmitEditing={(e)=>{submitInfo(e)}}
     autoCapitalize="words"
     autoCorrect={true}
     multiline
     numberOfLines={15}
     blurOnSubmit={true}
     ref={textInput}
     style={styles.textInput}
     />  
    </View>
    <View style={{  alignItems:`center`, justifyContent:`center`, marginTop:10,}}>
    <LinearGradient
            colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 60, width: 185,  borderRadius:50, alignItems: 'center', justifyContent: 'center',}}
            >
            <TouchableHighlight style={styles.touchStyle} onPress={()=>submitInfo()} >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableHighlight>
    </LinearGradient>
    </View>
    <Text style={styles.txt}>{sentText}</Text>
    {loading && <ActivityIndicator size="large" style={{marginBottom:20}} color='#FDB372' /> }
    </KeyboardAwareScrollView>
    </View>
    )
}

var widthVal = Dimensions.get('window').width; 
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#FFF',
        justifyContent:`center`,
        alignContent:`center`,
    },
    txt:{
        fontSize:15,  
        textAlign:`center`,
        fontFamily:`manrope`,
    },
    topText:{
        width:290,
        fontSize:40,  
        marginRight:50,
        fontFamily:`manrope-bold`,
    },
    topBar:{
        marginTop:20,
        padding:10,  
        paddingTop:20,
        flexDirection: 'row',
        flexWrap: 'wrap', 
        alignItems: 'flex-start', 
    },
    iconButton:{
        height:50,
        width:50,
        right:0,
        alignSelf:`flex-end`,
        marginBottom:0,
        alignContent:`center`,
        justifyContent:`center`,
    },
    textInput:{
        textAlignVertical:`top`,
        elevation:3,
        width:widthVal-30,
        height:450,
        margin:15,
        marginTop:0,
        padding:30,
        fontSize:18,
    },
    touchStyle:{    
        borderRadius:50,
        alignItems:`center`,
        justifyContent:`center`,
        padding:5,
        width:180,
        height:55,
        backgroundColor:`#FFF`,
        alignItems:`center`,
        justifyContent:`center`,
    },
    buttonText:{
        fontSize:20,
        fontFamily:`manrope-light`,
        color:`#FF3D00`,
    },
});