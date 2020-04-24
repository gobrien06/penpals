import * as React from 'react';
import {StyleSheet, TouchableHighlight } from 'react-native';


export default function HomeButton(props){
    const goHome = () => {
        
        props.navigation.navigate("Home");
    }

    if(props.color === "turq"){
        return(
            <TouchableHighlight onPress={() => goHome()} style={styles.iconHome}>
                    P
            </TouchableHighlight>
        )
    }
    else{
        return(
            <TouchableHighlight onPress={() => goHome()} style={styles.iconHome2}>
                  P
            </TouchableHighlight>
        )
    }

}

const styles = StyleSheet.create({
    iconButton:{
        elevation: 10,
        height:45,
        width:45,
        borderRadius:8,
        margin:10,
        marginTop:30,
    },
    iconHome:{
        elevation: 10,
        alignSelf: `flex-end`,
        position:`absolute`,
        
    },
})