import * as React from 'react';
//import  { Bubble, GiftedChat, InputToolbar, Send, Message} from 'react-native-gifted-chat';
import {StyleSheet, ScrollView, View, Text, TouchableHighlight, TextInput} from 'react-native';
import axios from 'axios';
import HomeButton from '../components/HomeButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LinearGradient} from 'expo-linear-gradient';

export default function ChannelScreen(props){
    const [messages,setMessages] = React.useState(['hey!']);
    const [formValue,setFormValue] = React.useState('');
    const [user, setUser] = React.useState('placeholder');
    const [newMessages,setNewMessages] = React.useState([]);

    const textInput = React.createRef();

    const submitInfo = () => {
        setNewMessages(newMessages => {
          if(formValue=='')
            return newMessages;
    
            newMessages.push(formValue);
            return newMessages;
        });
            //console.log("submitted");
            setFormValue('');
            textInput.current.clear();
      }

    
    const getMessages=()=>{/*
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.TOKEN,
            }
          }

          const channelId ={
            channelId: props.route.params.channelId,
          }

             
        axios.post('http://lahacks-hobbyist.tech:3000/chat/channels/messages',channelId,config)
        .then((response)=>{
            if(!(response.data[0]))
                return;
            else{
                setMessages(response.data.map((e)=>{return e.content}));
                }
            })
        .catch((errors)=>{
            console.log(errors);
        })
        console.log("msgs"+messages);
     
    */
    }

    const displayMessages = () =>{
        return (newMessages.map((items)=>{
            if(user === props.user){
                return (
                <View style={styles.bubbleTo}>
                <Text style={styles.bubbleTxt}>{items}</Text>
                <Text style={styles.bubbleDate}>somedatehere</Text>
                </View>
                )
            }
            else{
                return(
                <View style={styles.bubbleTo}>
                <Text style={styles.bubbleTxt}>{items}</Text>
                <Text style={styles.bubbleDate}>somedatehere</Text>
                </View>
                ) 
            }   
        }))
    }
    
    const sendMessage=(content)=>{ /*
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.TOKEN,
            }
          }

        const message ={
           content:content[0],
           channelId: props.route.params.channelId,
        }
        axios.post('http://lahacks-hobbyist.tech:3000/chat/channels/send', message,config)
        .then((response)=>{
            console.log(response.data);
        })
        .catch((error)=>{
            console.log(error);
        })
        */
    }

/*
    const onSend = (newMessage =[])=>{
        setMessages(GiftedChat.append(messages,newMessage));
        sendMessage(newMessage);
    }

    const renderInputToolbar=(props)=>{
        
        return <InputToolbar {...props} containerStyle={styles.toolBar}/>
    }
    
    const renderSend=(props)=>{
        return <Send {...props} textStyle={{color:'#FF7D00',  fontSize:25,
        fontFamily:'manrope',}}/>
    }
    */

    return(
        <View style={styles.container}>
        <KeyboardAwareScrollView style={{}}   scrollEnabled={false} extraScrollHeight={130} enableOnAndroid={true} enableResetScrollToCoords={true}>

            <View style={styles.topbar}>
                <Text style={styles.toptxt}>
                    {user}
                </Text>
                <HomeButton navigation={props.navigation} align='right'/>
            </View>
            <View style={styles.chatcontain}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    {displayMessages()}
                </ScrollView>
            </View>
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

/*
multiline = {true}
                numberOfLines = {3}
                */
/*
  <>

            <GiftedChat
                isAnimated
            messages={messages}
            onSend={ newMessage=>onSend(newMessage)}
            user={{
                _id: props.TOKEN,
                name:props.username,
            }}


            renderInputToolbar={renderInputToolbar}
            renderBubble={renderBubble}
            alwaysShowSend={true}
            renderSend={renderSend}
            bottomOffset={83}
            />
            </>
      
            */



const styles = StyleSheet.create({
    chatcontain:{
        height:500,
    
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
        height:90,
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
        fontSize:20,
        fontFamily:`manrope-light`,
    },
    submitBtn:{
        marginBottom:30, marginLeft:30,
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
});
