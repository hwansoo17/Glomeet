import React, { useEffect, useState } from "react";
import {View, Text, TouchableOpacity,StyleSheet,Image, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventEmitter from "react-native-eventemitter";
import MainButton from "../../customComponents/MainButton";
import { authApi } from "../../api";
import BannerImage from "../../assets/BannerImage.svg";
import MatchingLoading from "../../assets/MatchingLoading.svg";
import character from "../../assets/character.png";
const MatchingMainScreen = ({navigation}) => {
  const [matchStatus, setMatchStatus] = useState('noMatch');
  const [partnerNickName, setPartnerNickName] = useState('')
  const [partnerProfileImage, setPartnerProfileImage] = useState(null)
  const [chatRoomId, setChatRoomId] = useState('')
  const [partnerCountry, setPartnerCountry] = useState('')
  const [partnerType, setPartnerType] = useState('')
  const [dots, setDots] = useState('');
  const updateMatchStatus = async () => {
    try {
      const response = await authApi.get('/matching/status')
      if (response.status == 200) {
        if (response.data.status == 211) {
          console.log(response.data)
          setMatchStatus("matchingInProgress");
        }
        if (response.data.status == 212) {
          console.log(response.data)
          setMatchStatus("noMatch");
          
        }
        if (response.data.status == 213) {
          console.log(response.data)
          setPartnerNickName(response.data.nickName)
          setPartnerProfileImage(response.data.imageAddress)
          setPartnerCountry(response.data.country)
          setPartnerType(response.data.type)
          setChatRoomId(response.data.id)
          setMatchStatus("matchCompleted");
        }
      }
    } catch (error) {
      //if (error.response.status == 400) {
      console.log(error);
    };
  };
  
  useEffect(() => {
    updateMatchStatus();
  }, []);

  useEffect(() => {
    let interval;
    if (matchStatus =='matchingInProgress') {
      interval = setInterval(() => {
        setDots((prevDots) => {
          if (prevDots.length < 2) {
            return prevDots + '.';
          } else {
            return '';
          }
        });
      }, 500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [matchStatus]);

  const matchingSuccessEventListener = (message) => {
    setPartnerNickName(message.data.nickName);
    setPartnerProfileImage(message.data.imageAddress);
    setPartnerCountry(message.data.country)
    setPartnerType(message.data.type)
    setChatRoomId(message.data.id);
    
    setMatchStatus('matchCompleted');
  }
  const matchingInProgressEventListener = (e) => {
    setMatchStatus(e);
  }
  useEffect(()=>{
    EventEmitter.on("matchingInProgress",matchingInProgressEventListener)
    EventEmitter.on("matchingSuccess",matchingSuccessEventListener)
      
    return () => {
      EventEmitter.removeListener("matchingInProgress",matchingInProgressEventListener)
      EventEmitter.removeListener("matchingSuccess", matchingSuccessEventListener);
    };
  },[])
  const goChatRoom = async() => {
    try {
      const response = await authApi.get(`/matching/check/${chatRoomId}`)
      if (response.status == 200) {
        await navigation.navigate("Chatting")
        await navigation.navigate("Chatting", {screen: 'MatchingChatRoom', params: {chat: {id: chatRoomId, title: partnerNickName}}})
      }
    } catch (error) {
      if (error.response.status == 400) {
        Alert.alert("나간 채팅방입니다.")
      }
    }
    
  }
  const cancelMatching = async() => {
    try {
      const response = await authApi.delete('/matching/cancel')
      if (response.status == 200) {
        Alert.alert("매칭을 취소했어요.")
        updateMatchStatus()
      }
    } catch (error) {
      if (error.response.status == 400) {
      }
    }
  }
  const renderContent = () => {
    switch (matchStatus) {
      case 'noMatch':
        return (
          <View style={{flex:1}}>
            <View style={{flex:2}}/>
            <View style={{alignItems:'center'}}>
              <Text style={styles.matchingTitle}>오늘의 <Text style ={{color:"#5782F1"}}>매칭</Text>을 시작해보세요!</Text>
              <Text style={styles.matchingSubtitle}>오늘은 또 어떤 새로운 친구를 만날까?👀</Text>
            </View>
            <View style={{flex:1}}/>
            <View style={{backgroundColor: 'white', height:300, alignItems:'center', justifyContent:'center'}}>
                <Image source={character} style={{width:300, height:200}}/>
                <View style={{flex:1}}/>
                <View style={{height:70, width:'50%', borderRadius:10, backgroundColor:'white', elevation:5, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontFamily: 'Pretendard-Bold', fontSize:18, color:'#5782F1'}}>0P</Text>
                  <Text style={{fontFamily: 'Pretendard-Bold', fontSize:14, color:'#484848'}}>보유 포인트</Text>
                </View>
            </View>
            <View style={{flex:1}}/>
            <MainButton 
              onPress={() => navigation.navigate('MatchingFilter')}
              title={'매칭 시작하기'} 
              style={{ marginVertical: 15}}
            />
          </View>
        );
      case 'matchingInProgress':
        return (
          <View style={{flex:1}}> 
            <View style={{flex:1}}/>
            <View style={{alignItems:'center'}}>
              <Text style={styles.matchingTitle}><Text style ={{color:"#5782F1"}}>매칭</Text> 진행 중{dots}.</Text>
              <Text style={styles.matchingSubtitle}>조금만 기다려주세요!</Text>
            </View>
            <View style={{flex:1}}/>
            <View style={{backgroundColor: 'white', height:300, elevation:5, borderRadius:20, alignItems:'center', justifyContent:'center'}}>
              <MatchingLoading/>
            </View>
            <View style={{flex:2}}/>
            <MainButton 
              onPress={() => cancelMatching()} 
              title={'매칭 취소하기'} 
              style={{ marginVertical: 15}}
            />
          </View>
          
        );
      case 'matchCompleted':
        return (
          <View style={{flex:1}}>
            <View style={{flex:1}}/>
            <View style={{alignItems:'center'}}>
              <Text style={styles.matchingTitle}><Text style ={{color:"#5782F1"}}>매칭</Text>이 완료되었어요!</Text>
              <Text style={styles.matchingSubtitle}>이제 메세지를 보내보세요 👀</Text>
            </View>
            <View style={{flex:1}}/>
            <View style={{backgroundColor: 'white', height:300, elevation:5, borderRadius:20, alignItems:'center'}}>
              <View style={{flex:2}}/>
              <View style={{ width:120, height:120, borderRadius: 60, overflow: 'hidden', backgroundColor: 'grey'}}>
                <Image src={partnerProfileImage} style={{ width:120, height:120}}/>
              </View>
              <View style={{flex:1}}/>
              <Text style={{fontFamily:"GmarketSansTTFBold", fontSize: 30, color: '#5782F1'}}>{partnerNickName}</Text>
              <View style={{flex:0.5}}/>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:2}}/>
                <Text style={{fontFamily:"Pretendard-Regular", fontSize: 16, color: '#6B7079'}}># {partnerCountry}</Text>
                <View style={{flex:1}}/>
                <Text style={{fontFamily:"Pretendard-Regular", fontSize: 16, color: '#6B7079'}}># {partnerType}</Text>
                <View style={{flex:2}}/>
              </View>
              <View style={{flex:1.5}}/>
              <TouchableOpacity 
              onPress={goChatRoom}
              style={{height: 38, width:'90%', backgroundColor: 'white', borderRadius: 20, elevation:5, justifyContent:'center'}}>
                <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#635C5C', marginLeft:15}}>{partnerNickName}에게 메세지 보내기</Text>
              </TouchableOpacity>
              <View style={{flex:2}}/>
            </View>
            
            <View style={{flex:1}}/>
            <Text style={[styles.matchingSubtitle,{fontSize: 12, alignSelf:'center'}]}>가장 최근에 매칭한 상대방 정보는 하루 동안 표시돼요!</Text>
            <MainButton 
              onPress={() => navigation.navigate('MatchingFilter')} 
              title={'추가 매칭하기'} 
              style={{ marginVertical: 15}}
            />
          </View>
        );
      default:
        return (
          <Text style={styles.matchingTitle}>상태를 불러오는 중...</Text>
        );
  }
  };
  return (
    <View style={styles.backgroundContainer}>

      <View style={{flex:1}}/>
      <View style={{flex:8}}>
      <View style={{height:90, backgroundColor: '#ACD495', borderRadius: 10, paddingHorizontal:20, flexDirection: 'row', alignItems:'center', marginTop:20}}>
        <View>
          <Text style={{fontFamily: "Pretendard-Medium", fontSize: 12, color: "white"}}>
            건전한 문화 안내
          </Text>
          <Text style={{fontFamily: "Pretendard-Bold", fontSize: 14, color: "white"}}>
          비슷한 취미를 가진{"\n"}친구와 매칭돼요!
          </Text>
        </View>
        <View style={{flex:1}}/>
        <BannerImage/>
      </View>
      {renderContent()}
      </View>
      <View style={{flex:1}}/>

      
    </View>
  );
};

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        flexDirection: 'row'
    },
    matchingTitle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 26,
        color:'#000000',
        marginBottom:10
    },
    matchingSubtitle: {
        fontFamily: 'Pretendard-Medium',
        fontWeight: '500',
        fontSize: 14,
        color: '#B4B4B4',
    },
});



export default MatchingMainScreen;