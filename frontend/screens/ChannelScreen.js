import * as React from 'react';
import  { Bubble, GiftedChat, InputToolbar, Send, Message} from 'react-native-gifted-chat';
import {StyleSheet, View} from 'react-native';
import axios from 'axios';
import HomeButton from '../../../Hobbyist/components/HomeButton';

export default function ChannelScreen(props){
    const [messages,setMessages] = React.useState([]);

    const getMessages=()=>{
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
     
    
    }


    const sendMessage=(content)=>{
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
        snapshot();
    }

    const renderBubble=(props)=>{
        return <Bubble {...props} 

        wrapperStyle={{
            left: {
              backgroundColor: '#47CEB2',
            },
            right:{
                backgroundColor:'#000',
            
            }
          }}
       
          />
    }
    

    const onSend = (newMessage =[])=>{
        setMessages(GiftedChat.append(messages,newMessage));
        sendMessage(newMessage);
        snapshot();
    }

    const renderInputToolbar=(props)=>{
        
        return <InputToolbar {...props} containerStyle={styles.toolBar}/>
    }
    
    const renderSend=(props)=>{
        return <Send {...props} textStyle={{color:'#47CEB2',  fontSize:25,
        fontFamily:'Nunito',}}/>
    }
    
    React.useEffect(getMessages,[]);

    return(
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
            listViewProps={
                {
                    style: {
                    backgroundColor: '#202020',
                    },
            }}
            />
          <HomeButton navigation={props.navigation} color='turq'/>
            </>
      
    ) 
}



const styles = StyleSheet.create({
    empty:{
        backgroundColor:'#202020',
    },
    toolBar:{
        backgroundColor:'#202020',
        borderTopWidth:0,
        height:50,
    },
    toolText:{
        fontSize:20,
        fontFamily:'Nunito',
        color:'grey'

    }
});
