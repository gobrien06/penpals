import * as React from 'react';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';



export default function HomeButton(props){
    const goHome = () => {
        props.navigation.navigate("Home");
    }
    const txt = '>';

    if(props.align === "right"){
        return(
        <TouchableHighlight onPress={() => goHome()} style={styles.iconButton}>   
        <Text style={{textAlign:`center`,fontSize:45,fontFamily:`manrope-bold`,color:`#FF7D00`}}>
            {txt}
        </Text>        
        </TouchableHighlight>
        )
    } 
    else{
        return(
        <TouchableHighlight onPress={() => goHome()} style={styles.iconButton2}>   
        <Text style={{textAlign:`center`,fontSize:45,fontFamily:`manrope-bold`,color:`#FF7D00`}}>
            {txt}
        </Text>        
        </TouchableHighlight>
        )
    }
      


}

const styles = StyleSheet.create({
    iconButton:{
        height:50,
        width:50,
        right:0,
        alignSelf:`flex-end`,
        marginBottom:0,
        alignContent:`center`,
        justifyContent:`center`,
    },
    iconButton2:{
        height:30,
        width:50,
        borderRadius:10,        
        marginBottom:0,
        alignContent:`center`,
        justifyContent:`center`,
    },
})