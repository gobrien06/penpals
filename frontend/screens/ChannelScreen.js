import * as React from 'react';
import {StyleSheet, ScrollView, View, Text, TouchableHighlight, TextInput, ActivityIndicator} from 'react-native';
import axios from 'axios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import useTimeout from 'use-timeout';


export default function ChannelScreen(props){
    const [messages,setMessages] = React.useState([]);
    const [formValue,setFormValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const currentDate = moment().format("MM/DD/YYYY HH:mm");
    const username = props.username;

    var source;
    const CancelToken = axios.CancelToken;
    source = CancelToken.source();
    const textInput = React.createRef();

    const submitInfo =   () => {
        if(formValue === '')
            return;

        sendMessage(formValue);
        getMessages();
        setFormValue('');
        textInput.current.clear();
      }


    const goHome = () => {
        source.cancel('Leaving page. Canceling request');
        props.navigation.navigate("Home");
    }
    const txt = '>';

    
    const getMessages=()=>{
        setLoading(true);
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }

          const channelId ={
            channelId: props.route.params.channelId,
          }

             
        axios.post('http://104.154.57.17:3000/chat/channels/messages',channelId,config, {cancelToken:source.token})
        .then((response)=>{
            console.log(response.data);
            if(!(response.data[0])){
                setLoading(false);
                return;
            }
            else{
                setMessages(response.data.map((e)=>{return e.content}));
                }
            })
        .catch((errors)=>{
            console.log(errors);
        })
        setLoading(false);
    }


    const displayMessages = () =>{
        return (messages.map((items)=>{
            {items==='' && null}
            if(items.username === props.route.params.username){
                return (
                <View style={styles.bubbleFrom}>
                <Text style={styles.bubbleTxt}>{items.message}</Text>
                <Text style={styles.bubbleDate}>{items.date}</Text>
                </View>
                )
            }
            else{
                return(
                <View style={styles.bubbleTo}>
                <Text style={styles.bubbleTxt}>{items.message}</Text>
                <Text style={styles.bubbleDate}>{items.date}</Text>
                </View>
                ) 
            }   
        }))
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
        })
        .catch((error)=>{
            console.log(error);
        })
        setLoading(false);
    }

    React.useEffect(getMessages,[]);
    useTimeout(()=>getMessages(),2000);

    return(
        <View style={styles.container}>
        <KeyboardAwareScrollView style={{}}   scrollEnabled={false} extraScrollHeight={130} enableOnAndroid={true} enableResetScrollToCoords={true}>

            <View style={styles.topbar}>
                <Text style={styles.toptxt}>
                    {props.route.params.user}
                </Text>
                <TouchableHighlight onPress={() => goHome()} style={styles.iconButton}>   
                <Text style={{textAlign:`center`,fontSize:45,fontFamily:`manrope-bold`,color:`#FF7D00`}}>
                    {txt}
                </Text>        
                </TouchableHighlight>
                </View>
            <View style={styles.chatcontain}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    {displayMessages()}
                </ScrollView>
            </View>
            {loading && <ActivityIndicator size="large"  style={{marginBottom:15}} color='#FDB372'/>}
            <View style={styles.footer}>
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
      
                <TouchableHighlight style={styles.submitBtn} onPress={submitInfo}>
                    <Text style={styles.btnTxt}>
                        Send
                    </Text>
                </TouchableHighlight>
            </View>
            </KeyboardAwareScrollView>
            </View> 
    ) 
}

const styles = StyleSheet.create({
    chatcontain:{
        height:450,
    
    },
    container:{
        flex:1,
        backgroundColor: '#FFF',
    },
    toolBar:{
        borderTopWidth:0,    
        height:50,
    },
    toptxt:{
        width:250,
        fontSize:40,  
        marginRight:90,
        fontFamily:`manrope-bold`,
    },
    topbar:{
        padding:10,  
        paddingTop:20,
        flexDirection: 'row',

        flexWrap: 'wrap', 
        alignItems: 'flex-start', 
    },
    footer:{
        flexDirection: 'row',
        height:100,
        flexWrap: 'wrap', 
        alignItems: 'flex-end',
        padding:15,
        paddingTop:0,
        bottom:0,
    },
    bubbleFrom:{
        elevation:5,
        maxWidth:220,
        margin:10,
        marginLeft:20,
        padding:10,
        backgroundColor:`#FDB372`,
        borderRadius:15,
    },
    bubbleTo:{
        elevation:5,
        maxWidth:220,
        margin:10,
        marginLeft:20,
        padding:10,
        alignSelf: 'flex-end',
        borderRadius:15,
        backgroundColor:`#FF7563`,
    },
    bubbleTxt:{
        color:`#FFF`,
        fontSize:20,
        fontFamily:`manrope`,
    },
    bubbleDate:{
        color:`#FFF`,
        bottom:0,
        fontSize:15,
        fontFamily:`manrope-light`,
    },
    submitBtn:{
        marginBottom:35, marginLeft:45,
        elevation:5,
        borderRadius:15,
        width:85,
        height:50,
        justifyContent:`center`,
        backgroundColor:`#FFF`,
    },
    btnTxt:{
        textAlign:`center`,
        color:`#000`,
        fontSize:25,
        fontFamily:`manrope-light`,
    },
    textInput:{
        height:100,
        width:230,
        margin:10,
        fontSize:20,
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
});
