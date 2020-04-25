import * as React from 'react';
import {View,ScrollView,Text,StyleSheet, TouchableHighlight, Dimensions, ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import axios from 'axios';

export default function ChatScreen(props){
    const [unJoined, setUnJoined] = React.useState([]);
    const [joined, setJoined] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [canceled, setCanceled] = React.useState('n');   
    const [isOpen, setOpen] = React.useState(false); 
    
    var source;
    const CancelToken = axios.CancelToken;
    source = CancelToken.source();
    //notify users of new chat channels? - planned future functionality

    const goHome = () => {
        source.cancel('Leaving page. Canceling request');
        props.navigation.navigate("Home");
    }
    const txt = '>';

    const getChannels=()=>{
        setLoading(true);
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }
    
        axios.get('http://104.154.57.17:3000/chat/channels/',config, {cancelToken:source.token},{timeout: 20})
        .then((response)=>{
            if(response.data.channels==[] && response.data.pending_channels==[]){
                setLoading(false);
                return;
            }
            console.log(response.data.pending_channels)
            console.log(response.data.channel);
            setUnJoined(response.data.pending_channels);
            setJoined(response.data.channels);
        })
        .catch((error)=>{
            console.log(error);
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
          
        axios.post('http://104.154.57.17:3000/chat/channels/leave',channelId,config,{cancelToken:source.token})
        .then(()=>{
            setJoined(joined => {
                return joined.splice(i,1);
            });
            })
        .catch((error)=>{
                console.log(error);
        })
        .finally(()=>{
            setLoading(false);
            getChannels();
        })
    }


    const handleUnJoinRemove=(i)=>{
        setLoading(true);
        const id = {
            channelId:unJoined[i].channelId,
        }
        const config = {
            headers: {
              'Authorization': 'BEARER ' + props.route.params.TOKEN,
            }
          }

        axios.post('http://104.154.57.17:3000/chat/channels/leave',id,config)
        .then(()=>{
            setUnJoined(unJoined => {
                return unJoined.splice(i,1);
            });
            console.log("in the then");
            })
        .catch((error)=>{
            console.log(error);
        })
        .finally(()=>{
            setLoading(false);
            getChannels();
        })    
   
   
    }

    const reply=(i)=>{
        setLoading(true);
        setLoading(false);
        source.cancel('Left page, request cancelled.');
        props.navigation.navigate('Channel', {channelId:joined[i].channelId, TOKEN:props.route.params.TOKEN, user:joined[i].members});
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
  
        console.log('accepted' + accepted);
        axios.post('http://104.154.57.17:3000/chat/channels/join',accepted,config,{cancelToken:source.token})
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
        let chatsIn = []
        {unJoined.length &&
            (
                unJoined.map((item, index)=>
                {  chatsIn.push(
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
                {  chatsIn.push(
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
        return chatsIn;
    }
        
    
    React.useEffect(getChannels,[]);



    return(
        <View style={styles.container}>
            
            <View style={styles.topBar}>
             
                <Text style={styles.topText}>
                Conversations.
                </Text>
                <TouchableHighlight onPress={() => goHome()} style={styles.iconButton}>   
                <Text style={{textAlign:`center`,fontSize:45,fontFamily:`manrope-bold`,color:`#FF7D00`}}>
                    {txt}
                </Text>        
                </TouchableHighlight>
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

    },
    iconButton:{
        height:50,
        width:50,
        right:0,
        alignSelf:`flex-end`,
        marginBottom:0,
        alignContent:`center`,
        justifyContent:`center`,
    }
});