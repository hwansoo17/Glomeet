import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, FlatList, ImageBackground, Image, Alert} from 'react-native';
import EditIcon from '../../assets/editIcon.svg'
import Arcade from '../../assets/Arcade.svg';
import Arrow from '../../assets/arrow.svg';
import { authApi } from '../../api';
import { useTranslation } from "react-i18next";

const HomeMain = ({navigation}) => {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState([])
  const [trendMeetingData, setTrendMeetingData] = useState([])
  const [point, setPoint] = useState([])
  const [MyMeetingCount, setMyMeetingCount] = useState(0)
  const getUserProfile = async() => {
    try {
      const response = await authApi.get('/user/profile')
      if (response.status == 200) {
        setUserProfile(response.data)
        console.log(response.data, ': 프로필');
      };
    } catch (error) {
      console.log(error);
    };
  };
  const getTrendMeetings = async() => {
    try {
      const response = await authApi.get('/meeting/trend')
      if (response.status == 200) {
        setTrendMeetingData(response.data)
        console.log(response.data, ': 지금 뜨는 모임');
      };
    } catch (error) {
      console.log(error);
    };
  }
  const getPoint = async() => {
    try {
      const response = await authApi.get('/point/sum')
      if (response.status == 200) {
        setPoint(response.data.point)
        console.log(response.data)
      };
    } catch (error) {
      console.log(error,'너야?');
    };
  }
  const getMyMeetingCount = async() => {
    try {
      const response = await authApi.get('/meeting/count')
      if (response.status == 200) {
        setMyMeetingCount(response.data.count)
        console.log(response.data)
      };
    } catch (error) {
      console.log(error,'너야?');
    };
  }
  const goMeetingRoom = async(meeting) => {
    await navigation.navigate('Meeting')
    await navigation.navigate('Meeting', {screen: 'MeetingDetail', params: {meeting}})
  }
  useEffect(() => {
    // getLocale()
    getUserProfile()
    getTrendMeetings()
    getMyMeetingCount()
    // getPoint()
  },[])
  const goMeetingChatList = () => {
    navigation.reset({
        index: 0, 
        routes: [{
            name: 'Chatting', 
            state: {
              routes: [
                { name: 'ChattingMain',
                  state: {routes: [{name: '모임'}]} }, 
              ],
            },
          },
        ],
      })
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{width: 160, height: 180, backgroundColor:'grey', borderRadius:10, overflow: 'hidden'}}
      onPress={() => goMeetingRoom(item)}
    >
      <ImageBackground src={item.meetingImageAddress}
        style={{flex:1}} 
      >
        <View style={{flex:1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <View style={{width:50, height:24, backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius:10, alignItems:'center', justifyContent: 'center', margin:10}}>
          <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 12, color: '#fff'}}>{item.category}</Text>
        </View>
        <View style={{flex:1}}/>
        <Text style={{fontFamily: 'Pretendard-SemiBold', fontSize: 18, color: '#fff', margin:13}}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
);
  return (
    <View style={{ flex:1, backgroundColor: '#fff'}}>
      <View style={{flex:0.5}}/>
      <View style={{flexDirection:'row', alignItems:'center', margin: 10}}> 
        <View style={{ width:50, height:50, borderRadius: 25, marginRight:10, overflow: 'hidden'}}>
          {userProfile.imageAddress ? (
            <Image style={{flex:1}} src={userProfile.imageAddress}/>
          ) : (
            <View style={{backgroundColor: 'grey'}}/>
          )}
        </View>
        <Text style={{fontFamily: 'Pretendard-SemiBold', fontSize: 18, color: '#000'}}>
          {userProfile.nickName}
        </Text>
        <View style={{flex:1}}/>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile', {userProfile})}>
        <EditIcon/>
        </TouchableOpacity>
      </View>
      <View style={{flex:1}}/>
      <Text style={{fontFamily: 'Pretendard-SemiBold', fontSize: 20, color: '#000',margin:10}}>
        {t('homemain.trendmeeting')}
      </Text>
      <View>
        <FlatList
          data={trendMeetingData}
          renderItem={renderItem}
          horizontal
          ListHeaderComponent={<View style={{width:10}}/>}
          ListFooterComponent={<View style={{width:10}}/>}
          ItemSeparatorComponent={<View style={{width:10}}/>}
          showsHorizontalScrollIndicator={false}
          />
      </View>
      <View style={{flex:1}}/>
      <View style={{height:80, margin:10, elevation:10, backgroundColor:'#fff', borderRadius:10, flexDirection: 'row'}}>
      <TouchableOpacity 
        style={{flex:1, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => {Alert.alert(t("homemain.comingsoon"))}}
      >
        <Text style={{fontFamily: 'Pretendard-Bold', fontSize:18, color:'#5782F1'}}>0P</Text>
        <Text style={{fontFamily: 'Pretendard-Bold', fontSize:14, color:'#484848'}}>{t("homemain.point")}</Text>
      </TouchableOpacity>
      <View style={{width:2, height:48, backgroundColor:'#eaeaea', alignSelf: 'center'}}/>          
      <TouchableOpacity 
        style={{flex:1, justifyContent: 'center', alignItems: 'center'}}
        onPress={goMeetingChatList}
      >
        <Text style={{fontFamily: 'Pretendard-Bold', fontSize:18, color:'#5782F1'}}>{MyMeetingCount}개</Text>
        <Text style={{fontFamily: 'Pretendard-Bold', fontSize:14, color:'#484848'}}>{t("homemain.mymeeting")}</Text>
      </TouchableOpacity>
      </View>
      <View style={{flex:1}}/>
      <Text style={{fontFamily: 'Pretendard-SemiBold', fontSize: 20, color: '#000',margin:10}}>
      {t("homemain.challange")}
      </Text>
      <TouchableOpacity 
        style={{height:48, margin:10, backgroundColor:'#5782F1', borderRadius:10, flexDirection:'row', alignItems:'center'}}
        onPress={() => {Alert.alert(t("homemain.comingsoon"))}}
      >
        <Arcade style={{marginHorizontal :15}}/>
        <Text style={{fontFamily: 'Pretendard-Bold', fontSize:14, color:'#fff'}}>{t("homemain.gochallange")}</Text>
        <View style={{flex: 1}}/>
        <Arrow style={{marginHorizontal :8}}/>
      </TouchableOpacity>
      <View style={{flex:1}}/>
    </View>
  );
};

export default HomeMain;
