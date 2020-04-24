import * as React from 'react';
import {View,ScrollView,Text,StyleSheet, TouchableHighlight, Dimensions, ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import axios from 'axios';
import HomeButton from '../components/HomeButton';

export default function ChatScreen(props){
    const [unJoined, setUnJoined] = React.useState([{members:'unoiined',channelId:'4325436',}]);
    const [joined, setJoined] = React.useState([{members:'testing',channelId:'4325436',},]);
    const [loading, setLoading] = React.useState(false);
    const [canceled, setCanceled] = React.useState('n');
    var source;
    const CancelToken = axios.CancelToken;
    source = CancelToken.source();
    //notify users of new chat channels? - planned future functionality

    const getChannels=()=>{
        setLoading(true);
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }
    
        axios.get('http://104.57.17:3000/chat/channels/',config, {cancelToken:source.token})
        .then((response)=>{
            if(response.data.channels==[] && response.data.pending_channels==[]){
                setLoading(false);
                return;
            }
            console.log("RESPONSE" + response.data);
            setUnJoined(response.data.pending_channels);
            setJoined(response.data.channels);
        })
        .catch((error)=>{
            console.log("chat error" + error);
        })
        .finally(()=>{
            setLoading(false);
        })
        return;
    }

    const handleJoinRemove=(i)=>{
        setLoading(true);
        const channelId = {
            channelId:joined[i].channelId,
        }
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }
          
        axios.post('http://104.57.17:3000/chat/channels/leave',channelId,config,{cancelToken:source.token})
        .then(()=>{
            setJoined(joined => {
                return joined.splice(i,1);
            });
            })
        .catch((error)=>{
                console.log(error);
        })
        setLoading(false);
    }


    const handleUnJoinRemove=(i)=>{
        setLoading(true);
        const id = {
            id:unJoined[i].channelId,
        }
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }

        axios.post('http://104.154.17:3000/chat/channels/leave',id,config)
        .then(()=>{
            setUnJoined(unJoined => {
                return unJoined.splice(i,1);
            });

            })
        .then(()=>{
            getChannels();
        })
            
      .catch((error)=>{
            console.log(error);
      })
      setLoading(false);
    }

    const reply=(i)=>{
        setLoading(true);
        setLoading(false);
        props.navigation.navigate('Channel', {channelId:joined[i].channelId});
        source.cancel('Left page, request cancelled.');
    }

    const joinChannel = (i) =>{
        setLoading(true);
        const accepted={
          channelId:unJoined[i].channelId,
        }
        const config = {
          headers: {
            'Authorization': 'BEARER ' + props.route.params.TOKEN,
          }
        }
  
        console.log(accepted);
        axios.post('http://104.154.17:3000/chat/channels/join',accepted,config,{cancelToken:source.token})
        .then((response)=>{
          console.log(response);
          getChannels();
        }
        )
        .then(()=>{
            joined.append(unJoined[i]);
            unJoined.splice(i,1);   
        })
        .catch((error)=>{
          console.log(error);
        }
        )
        setLoading(false);
      }

    const getChats=()=>{
        let chats = []
        {unJoined.length &&
            (
                unJoined.map((item, index)=>
                {  chats.push(
                    <View style={{marginTop:10}}>
               
                        <View style={styles.channel}>
                        <Text style={styles.channelLabel}>{item.members}</Text>
                        <TouchableHighlight onPress={() => handleUnJoinRemove(index)}  style={styles.removeButton}><Text style={styles.closeText}>x</Text></TouchableHighlight>
                        <LinearGradient
                        colors={['#FF8800','#FF7400', '#FF7A00', '#FF5300', '#FF2100', '#FF3C00', ]}
                        start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        style={{ height: 55, width: 125,  borderRadius:50, alignItems: 'center', justifyContent: 'center',   marginTop:15,}}
                        >
                        <TouchableHighlight onPress={()=>joinChannel(index)} style={styles.reply}><Text style={styles.replyText}>Join</Text></TouchableHighlight>
                        </LinearGradient>
                        </View>
    
                    </View>
                    )
                })
            )
            
        }
        { joined.length &&
            (
                joined.map((item, index)=>
                {  chats.push(
                    <View style={{marginTop:10}}>
                
                    <View style={styles.channel}>
                    <Text style={styles.channelLabel}>{item.members}</Text>
                    <TouchableHighlight onPress={() => handleJoinRemove(index)}  style={styles.removeButton}><Text style={styles.closeText}>x</Text></TouchableHighlight>
                    <LinearGradient
                    colors={['#FF8800','#FF7400', '#FF7A00', '#FF5300', '#FF2100', '#FF3C00', ]}
                    start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                    style={{ height: 55, width: 125,  borderRadius:50, alignItems: 'center', justifyContent: 'center',   marginTop:15,}}
                    >
                    <TouchableHighlight onPress={()=>reply(index)} style={styles.reply}><Text style={styles.replyText}>Message</Text></TouchableHighlight>
                    </LinearGradient>
                    </View>
                 
                    </View>
                 )
                })
            )
        } 
        console.log("chats " + chats);
        return chats;
    }
        
    
    React.useEffect(getChannels,[]);



    return(
        <View style={styles.container}>
            
            <View style={styles.topBar}>
             
                <Text style={styles.topText}>
                Conversations.
                </Text>
                <HomeButton navigation={props.navigation} align="right"/>   
            </View>
            <ScrollView style={styles.displayChats}>
                {getChats()}
            </ScrollView>
            {loading && <ActivityIndicator size="large"  style={{marginBottom:15}} color='#FDB372'/>}

        </View>
    )
}

var widthVal = Dimensions.get('window').width + 10; 
const styles = StyleSheet.create({
    topText:{
        color:`#000`,
        fontSize:45,
        fontFamily:`manrope-bold`,
        textAlign:`left`,
        marginTop:15,
        marginRight:15,
    },
    topBar:{
        padding:10,
        height:90,
        width:widthVal,
        flexDirection: 'row',
    },
    container:{
        flex:1,
        backgroundColor: '#FFF',
        justifyContent:`center`,
        alignContent:`center`,
    },
    displayChats:{
        marginTop:20,
    },
    channel:{
        margin:10,
        elevation:5,
        height:130,
        width:390,
        borderRadius:10,
        backgroundColor:`#FFF`,
        textAlign:`left`,
        padding:10,
        paddingLeft:20,
        paddingRight:20,
    },
    channelLabel:{
        color:`#000`,
        fontFamily:`manrope-semi-bold`,
        fontSize:30,
    },
    removeButton:{
        justifyContent:`center`,
        height:55,
        width:50,
        borderRadius:10,
        alignSelf:`flex-end`,
        position:`absolute`,
      
    },
    closeText:{
        textAlign:`center`,
        fontSize:40,
        color:`#000`,
        fontFamily:`manrope`,
    },
    reply:{
        justifyContent:`center`,
        alignContent:`center`,
        height:50,
        width:120,
        borderRadius:50,
        backgroundColor:`#FFF`,
    },
    replyText:{
        textAlign:`center`,
        fontFamily:`manrope-light`,
        color:`#FF7D00`,
        fontSize:20,

    }
});