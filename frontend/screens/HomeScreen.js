import * as React from 'react';
import { Image, Platform, StyleSheet, View, Dimensions, TouchableHighlight, Text, ActivityIndicator } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

export default function HomeScreen(props) {
  const [loading, setLoading] = React.useState(false);
  const signUp = () =>{
    setLoading(true);
    props.navigation.navigate('Signup', {setTOKEN:props.setTOKEN});
    setLoading(false);
  }

  const login=()=>{
    setLoading(true);
    props.navigation.navigate('Login',{setTOKEN:props.setTOKEN});
    setLoading(false);
  }

  const logout=()=>{
    setLoading(true);
    props.setTOKEN(null);
    setLoading(false);
  }

  const goToEdit=()=>{
    setLoading(true);
    props.navigation.navigate('Language',{TOKEN:props.TOKEN});
    setLoading(false);
  }

  const toChat=()=>{
    setLoading(true);
    props.navigation.navigate('Chat',{TOKEN:props.TOKEN});
    setLoading(false);
  }


  return(
    <View style={styles.container}>
      <View style={styles.getStartedContainer}>
     
     <Image source={
       require('../assets/images/iu.png')
   
     }
     style={{
       marginTop:60,
       height:120,
       width:210,
     }
 
       }/>
       
        <Text
       style={{
         fontFamily:`manrope`,
         fontSize:60,
         color:'#000',
         fontWeight:`bold`,
   
       }}>
         PenPals
       </Text>
     </View>

    { (!props.TOKEN) ? (
      <View>
      <View style={styles.buttonContainer}>
      <LinearGradient
          colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
          start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
          style={{ height: 60, width: 285,  borderRadius:50, alignItems: 'center', justifyContent: 'center',}}
          >
      <TouchableHighlight style={styles.touchStyle} onPress={()=>login()}>
      
        <Text style={styles.buttonText}>Login</Text>
      </TouchableHighlight>
      </LinearGradient>
      <TouchableHighlight onPress={()=>signUp()}>
        <Text style={styles.freeText}>Or, click here to sign up.</Text>
      </TouchableHighlight>
      </View>
      {loading && <ActivityIndicator size="large" style={{marginBottom:20}} color='#FDB372'/>}
    </View> )
    : (<View style={styles.container}>
    <View style={styles.welcomeContainer}>
   
    
   </View>
  

<View style={styles.buttonContainer}>
<LinearGradient
  colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
  start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
  style={{ height: 60, width: 285,  borderRadius:50, alignItems: 'center', justifyContent: 'center',marginTop:-30,}}
  >
<TouchableHighlight style={styles.touchStyle} onPress={()=>toChat()}>
  <Text style={styles.buttonText}>Chat</Text>
</TouchableHighlight>
</LinearGradient>
<LinearGradient
  colors={['#FF2100', '#FF3C00', '#FF5300', '#FF7A00', '#FF7400', '#FF8800']}
  start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
  style={{ height: 60, width: 285,  borderRadius:50, alignItems: 'center', justifyContent: 'center', marginTop:20,}}
  >
<TouchableHighlight style={styles.touchStyle} onPress={()=>goToEdit()} >
        <Text style={styles.buttonText}>Settings</Text>
</TouchableHighlight>
</LinearGradient>
<TouchableHighlight style={styles.lilLog} onPress={()=>logout()}>
  <Text style={styles.logbuttonText}>Logout</Text>
</TouchableHighlight>

</View>
{loading && <ActivityIndicator size="large" style={{marginBottom:20}} color='#FDB372'/>}

</View>
    )
    }
  </View>
  );
}


var widthVal = Dimensions.get('window').width + 10; 

const styles = StyleSheet.create({
  freeText:{
    margin:20,
    width:400,
    color:`black`,
    fontSize:20,
    textAlign:`center`,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  buttonContainer:{
    marginTop:-30,
    alignItems:`center`,
    justifyContent:`center`,
  },
  touchStyle:{

    backgroundColor:`#FFF`,
    borderRadius:50,
    marginVertical:20,
    alignItems:`center`,
    justifyContent:`center`,

    width:280,

    height:55,
  },
  lilLog:{
    elevation:8,
    marginTop:30,
    marginBottom:30,
    borderRadius:50,
    alignItems:`center`,
    backgroundColor:`#FFF`,
    justifyContent:`center`,
    borderColor:`#000`,
    padding:5,
    width:150,
    height:50,
  },
  logbuttonText:{
    fontSize:25,
    fontFamily:`manrope`,
    color:`#000`,
  },
  buttonText:{
    fontSize:25,
    fontFamily:`manrope`,
    color:`#FF3D00`,
  },
  bottomBubble:{
    alignSelf:`flex-end`,
    marginTop:90,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 160,
    resizeMode: 'contain',
    paddingTop: 3,
    marginLeft: -10,
  },
  midImageBub:{
    position:`absolute`,
    marginTop:15,
  },
  headerImage: {
    width:widthVal,
    height:200,
    marginTop:-110,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginVertical:50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
      height: 20,
      width: 200,
      color: `#FAE99E`,
      fontFamily: "Avenir",
      fontSize: 40,
      lineHeight: 80,
      textAlign: `center`,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
