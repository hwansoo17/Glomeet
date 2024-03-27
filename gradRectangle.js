import React from 'react';
import { View,TouchableOpacity,TextInput, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Homemain from "./assets/homemain.svg";
import Bell from "./assets/bell.svg";
import InputBoxNovalue from './CustomComponent'
const TEXTS = { subtitle: ["관심분야","성향","키워드 태그"], };
const GradRectangle = ({hasSVG}) => {
    return (
      <View style={[{ flex: 1, borderRadius: 20 }]}>
        <LinearGradient
          colors={['#BFD0FA', 'rgba(213, 223, 249, 1)']}
          style={{ flex: 1, borderRadius: 20 }}
        >
          {hasSVG && (
            <View style={{ flex: 1, flexDirection: 'row',justifyContent: 'center', marginTop:20,marginLeft:60 }}>
              <Homemain/>
            <View style= {{width: 20}}/>
            <Bell/>
            </View> 
          )}
          <View style= {{flex:0.5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.textTitle}>귀여운다은</Text>
          </View>
          <View style={styles.textContainer}>
            <View style= {{flex:0.5, flexDirection: 'column'}}/>
            <View style= {{flex:4, flexDirection: 'column'}}>

              <View style= {{flex:1, flexDirection: 'row'}}>
              <Text style={styles.subtitle}>{TEXTS.subtitle[0]}</Text> 
              </View>
              <View style= {{flex:1, flexDirection: 'row'}}>
              <Text style={styles.subtitle}>{TEXTS.subtitle[1]}</Text> 
              </View>
              <View style= {{flex:2, flexDirection: 'row'}}>
              <Text style={styles.subtitle}>{TEXTS.subtitle[2]}</Text> 
              </View> 
            </View>    
            <View style={{flex: 6, justifyContent: 'center', alignItems: 'center'}}>
            </View>
            <View style = {{flex:2}}/> 
            {/* 원하는 만큼 텍스트를 추가할 수 있습니다 */}
          </View>
        
        </LinearGradient>
  
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
      },
    textTitle: {
      flex: 1,
      fontSize: 30,
      fontWeight: 'bold',
      color: "#001F6F"
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 10,
      
    },
    textContainer:{
      flex: 1,
      flexDirection: 'row',
      color: '#25282B',
      fontSize: 16,
    },
    input: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: '#887E7E',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginRight: 10,
    },
    text: {
      marginLeft: 10,
      color: '#25282B',
      fontSize: 18,
      fontWeight: 'bold',
    },
    imageContainer: {
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 20,
    },
    imageStyle: {
      width: 200,
      height: 200,
    },
  });

export default GradRectangle;