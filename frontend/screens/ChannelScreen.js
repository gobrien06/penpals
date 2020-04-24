import * as React from 'react';
//import  { Bubble, GiftedChat, InputToolbar, Send, Message} from 'react-native-gifted-chat';
import {StyleSheet, FlatList, View, Text, TouchableHighlight, TextInput} from 'react-native';
import axios from 'axios';
import HomeButton from '../components/HomeButton';
import LinearGradient from 'expo-linear-gradient';

export default function ChannelScreen(props){
    const [messages,setMessages] = React.useState([{content:'gdfgfdsgdg',user:'gdfgfdg'}]);
    const [user, setUser] = React.useState('placeholder');

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
    React.useEffect(getMessages,[]);

    return(
        <View style={styles.container}>
            <View style={styles.topbar}>
                <Text style={styles.toptxt}>
                    {user}
                </Text>
                <HomeButton navigation={props.navigation} align='right'/>
            </View>
            <View style={styles.chatcontain}>
                <FlatList />
            </View>
            <View style={styles.footer}>
                <TextInput />
                <LinearGradient
                   colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
                   start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                   style={{ height: 65, width: 205,  borderRadius:50, alignItems: 'center', justifyContent: 'center',}}
                >
                <TouchableHighlight>
                    <Text style={styles.btnTxt}>
                        Send
                    </Text>
                </TouchableHighlight>
                </LinearGradient>
            </View>
            </View> 
    ) 
}

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
        position: 'absolute',
        flexDirection: 'row',
        height:50,
        flexWrap: 'wrap', 
        alignItems: 'flex-end',
        padding:20,
        paddingTop:0,  
        bottom:0,
    },
    bubbleFrom:{
        height:200,
        width:200,
        backgroundColor:`#FDB372`,
    },
    bubbleTxt:{
        color:`#FFF`,
        fontSize:25,
        fontFamily:`manrope`,
    },
    submitBtn:{
        elevation:5,
        borderRadius:50,
        width:70,
    },
    btnTxt:{
        color:`#FF2200`,
        fontSize:25,
        fontFamily:`manrope-light`,
    },
});
