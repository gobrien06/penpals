import * as React from 'react';
import {View,ScrollView,Text,StyleSheet, TouchableHighlight, Dimensions, Image} from 'react-native';
import axios from 'axios';
import HomeButton from '../components/HomeButton';

export default function ChatScreen(props){
    const [unJoined, setUnJoined] = React.useState([]);
    const [joined, setJoined] = React.useState([]);

    const getChannels=()=>{
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }
    
        axios.get('http://lahacks-hobbyist.tech:3000/chat/channels/',config)
        .then((response)=>{
            if(response.data.channels==[] && response.data.pending_channels==[])
                return;
            
            setUnJoined(response.data.pending_channels);
            setJoined(response.data.channels);
        })
        .catch((error)=>{
            console.log(error);
        })

        return;
    }

    const handleJoinRemove=(i)=>{
        const channelId = {
            channelId:joined[i].channelId,
        }
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }

        axios.post('http://lahacks-hobbyist.tech:3000/chat/channels/leave',channelId,config)
        .then(()=>{
            setJoined(joined => {
                let old = [...joined];
                old.splice(i,1);
                return old;
            });
            })
      .catch((error)=>{
            console.log(error);
      })

    }


    const handleUnJoinRemove=(i)=>{
        const id = {
            id:unJoined[i].channelId,
        }
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }

        axios.post('http://lahacks-hobbyist.tech:3000/chat/channels/leave',id,config)
        .then(()=>{
            setUnJoined(unJoined => {
                let old = [...unJoined];
                old.splice(i,1);
                return old;
                getChannels();
            });

            })
            
      .catch((error)=>{
            console.log(error);
      })

    }

    const reply=(i)=>{
        props.navigation.navigate('Channel', {channelId:joined[i].channelId});
    }

    const joinChannel = async(i) =>{
        const accepted={
          channelId:unJoined[i].channelId,
        }
        const config = {
          headers: {
            'Authorization': 'BEARER ' + props.route.params.TOKEN,
          }
        }
  
        console.log(accepted);
        await axios.post('http://lahacks-hobbyist.tech:3000/chat/channels/join',accepted,config)
        .then((response)=>{
          console.log(response);
          joined.append(unJoined[i]);
          unJoined.splice(i,1);
          getChannels();
        }
        )
        .catch((error)=>{
          console.log(error);
        }
        )
      }

    const getChats=()=>{
        let chats = [ ];
        if(!joined||!unJoined)
        return;
        if(unJoined.length){
            for(let i=0;i<unJoined.length;i++){ 
                chats.push(
                  <View style={styles.channel}>
                  <Text style={styles.channelLabel}>{unJoined[i].members}</Text>
                  <TouchableHighlight onPress={() => handleUnJoinRemove(i)}  style={styles.removeButton}><Text style={styles.closeText}>x</Text></TouchableHighlight>
                  <TouchableHighlight onPress={()=>joinChannel(i)} style={styles.reply}><Text style={styles.replyText}>Join</Text></TouchableHighlight>
                  </View>
               )}
        }
        if(joined.length)
         {  for(let i=0;i<joined.length;i++){
            chats.push(
              <View style={styles.channel}>
              <Text style={styles.channelLabel}>{joined[i].members}</Text>
              <TouchableHighlight onPress={() => handleJoinRemove(i)}  style={styles.removeButton}><Text style={styles.closeText}>x</Text></TouchableHighlight>
              <TouchableHighlight onPress={()=>reply(i)} style={styles.reply}><Text style={styles.replyText}>Message</Text></TouchableHighlight>
              </View>
           )}}
        
        console.log("chats" + chats);
        return chats;
    }
        
    
    React.useEffect(getChannels,[]);



    return(
        <View style={styles.container}>
            
            <View style={styles.topBar}>
             
                <Text style={styles.topText}>
                Conversations.
                </Text>
          
           
            </View>
            <ScrollView style={styles.displayChats}>
                {getChats()}
            </ScrollView>
            <Image source={
                require('../assets/images/oc-1.png')
            }
            style={{
                elevation:-1,
                height:250,
                width:widthVal,
                borderTopRightRadius:100,
                borderTopLeftRadius:100,
            }}/>
            <HomeButton navigation={props.navigation} color='turq'/>
        </View>
    )
}

var widthVal = Dimensions.get('window').width + 10; 
const styles = StyleSheet.create({
    topText:{
        color:`#FFF`,
        fontSize:45,
        fontFamily:`Nunito`,
        fontWeight:`bold`,
        textAlign:`left`,
        marginTop:15,
        //fontWeight:`bold`,
    },
    topBar:{
        padding:10,
        height:50,
        width:widthVal,
        marginBottom:30,
        
    },
    container:{
        flex:1,
        backgroundColor: '#202020',
      
    },
    channel:{
   
        marginTop:60,
        height:150,
        width:widthVal,
        borderWidth:1,
        borderColor:`#000`,
        borderRadius:8,
        backgroundColor:`#202020`,
        textAlign:`left`,
        padding:5,
        paddingLeft:10,
        paddingRight:20,
    },
    channelLabel:{
        color:`#FFF`,
        fontFamily:`Nunito`,
        fontWeight:`300`,
        fontSize:30,
        
    },
    removeButton:{
        justifyContent:`center`,
        height:55,
        width:60,
        borderRadius:10,
        alignSelf:`flex-end`,
        position:`absolute`,
      
    },
    closeText:{
        textAlign:`center`,
        fontSize:45,
        color:`#FFF`,
        fontFamily:`Nunito`,
    },
    reply:{
        textAlign:`left`,
        justifyContent:`center`,
        alignContent:`center`,
        height:50,
        width:120,
        marginTop:15,
        borderRadius:10,
        backgroundColor:`#47CEB2`,
       

    },
    replyText:{
        textAlign:`center`,
        fontFamily:`Nunito`,
        color:`#202020`,
        fontSize:20,

    }
});