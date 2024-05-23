import React, { useState,useEffect, useLayoutEffect } from "react";
import {View, Text, TouchableOpacity, FlatList, Image, Modal, TextInput, Alert, InputAccessoryView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api"
import {RefreshControl} from 'react-native';
import { formatDate } from "../ChattingScreens/formatDate";
import { useTranslation } from "react-i18next";
const MeetingMain = ({navigation}) => {
  const { t } = useTranslation();
	const [meetingData, setMeetingData] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredMeetingData, setFilteredMeetingData] = useState([]);
  const category = ['ALL', '운동', '여행','게임','문화','음식','언어']
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState([])
  const [reportComment, setReportComment] = useState('')
  const [reportEnabled, setReportEnabled] = useState(false)
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('MeetingCreate')}>
          <Text style={{paddingTop:2, fontSize:14, fontFamily: 'Pretendard-SemiBold', color: '#09111F'}}>{t("meeting.registermeeting")}</Text>
        </TouchableOpacity>
      ),
    });
  }, [t]);

  useEffect(() => {
    if (reportComment != '') {
      setReportEnabled(true);
    } else {
      setReportEnabled(false);
    }
  }, [reportComment]);

  const filterMeetingData = (category) => {
    if (category === 'ALL') {
      setFilteredMeetingData(meetingData);
    } else {
      const filtered = meetingData.filter(
        (item) => item.category === category
      );
      setFilteredMeetingData(filtered);
    }
  };

  const handleRefresh = async () => {
    console.log('handleRefreshStore');
    setIsRefreshing(true);
    getMeetingData()
    setIsRefreshing(false);
  };
  
  const getMeetingData = async () => {
    try {
      const response = await authApi.get('/meeting/all')
    if (response.status == 200) {
        setMeetingData(response.data)
        console.log(response.data, ': 미팅all');
      };
    } catch (error) {
      console.log(error);
    };
  };
  useEffect(() => {
    getMeetingData()
  }, [])
  useEffect(() => {
    filterMeetingData(selectedCategory)
  },[meetingData,selectedCategory])

	const goMeetingRoom = (meeting) => {
    navigation.navigate("MeetingDetail", { meeting });
  };

  const reportMeeing = async() => {
    setReportComment('')
    Alert.alert(t("MeetingList.report"))
    // try {
    //    const response = await authApi.post('/report/Meeting', { roomId: selectedMeeting.roomId, targetNickName: selectedChatUser.senderNickName, comment: reportComment})
    //   if (response.status == 200) {
    //     setReportComment('')
    //     Alert.alert(t("ChatRoom.report"))
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
  }

	const renderItem = ({ item }) => (
      <TouchableOpacity
        style={{flex:1}}
        onPress={() => goMeetingRoom(item)}
        onLongPress={()=>{
          setModalVisible(true) 
          setSelectedMeeting(item)}}>
        <View style={{flex:1, flexDirection: "row", alignItems: "center"}}>
          <View style={{width: 70, height: 70, backgroundColor:'grey', borderRadius: 10, margin:10, overflow: 'hidden'}}>
            <Image src={item.meetingImageAddress} style={{flex:1}}/>
          </View>
          <View style={{flex:1, height: 90, borderBottomWidth:1, borderColor: '#E1E5EB',justifyContent:'center', marginRight:10}}>
            <View style={{flexDirection: "row", alignItems: "center", maxWidth: '80%'}}>
              <Text style={{fontSize:16, fontFamily: 'Pretendard-Regular', marginRight:5, color: '#09111F'}} numberOfLines={1}>{item.title}</Text>
              <Text style={{fontSize:12, fontFamily: 'Pretendard-Regular', color: '#08C754', backgroundColor: '#D7F6E4', paddingHorizontal:5, borderRadius: 4}}>{t(`category.${item.category}`)}</Text>
            </View>
            <Text style={{fontSize:14, fontFamily: 'Pretendard-Regular', color: '#6B7079'}} numberOfLines={1}>{t("meeting.current")} {item.participants} {t("meeting.participating")}</Text>
          </View>
        </View>
      </TouchableOpacity>
 
  );
  const renderCategory = ({ item }) => (
  <TouchableOpacity
    onPress={() => setSelectedCategory(item)}
    style={[{backgroundColor: '#D1DCFB', paddingHorizontal:20, paddingVertical:7, borderRadius:10}, selectedCategory == item && {backgroundColor: '#5782F1'}]}
  >
    <Text style={[{fontSize:14, fontFamily: 'Pretendard-Regular', color: '#6B7079'}, selectedCategory == item && { color: '#ffffff'}]}>{t(`category.${item}`)}</Text>
  </TouchableOpacity>
  )
  return (
		<View style={{flex:1, backgroundColor: 'white'}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(false);
          setReportComment('')
        }}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <TouchableOpacity 
            style={{flex:1}}
            onPress={() => setModalVisible2(false)}/>
          <View style={{minHeight:200, flexDirection: 'row'}}>
          {Platform.OS === 'ios' ? (
            <InputAccessoryView style={{ flexDirection: "row"}}>
              <View style={{flex:1,backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:15}}>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079', alignSelf:'center'}}>{t("MeetingList.reasonReporting")}</Text>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 12, color: '#6B7079', alignSelf:'center', textAlign:'center'}}>{t("MeetingList.reportingNotice")}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex:1}}/>
                  <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 14, color: '#D3D3D3'}}>{reportComment.length}/255</Text>
                </View>
                <View style={{borderRadius:10, backgroundColor: "#EEF3FF", padding:5, margin:10}}>
                  <TextInput
                    value={reportComment}
                    multiline
                    onChangeText={setReportComment}
                    maxLength={255}/>
                </View>
                <View style={{flex:1}}/>
                <View style={{ flexDirection:"row"}}>
                  <View style={{flex:1}}/>
                  <TouchableOpacity
                    onPress={() => {setModalVisible2(false); reportMeeing()}} //reportMeeing() 기능 추가
                    disabled={!reportEnabled}
                  >
                    <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: reportEnabled ? '#EC3232' : '#D3D3D3'}}>{t("MeetingList.toReport")}</Text>
                  </TouchableOpacity>
                </View>
            </View>
            </InputAccessoryView>
          ) : (
            <View style={{flex:1,backgroundColor: "white", shadowColor: "#000",shadowOffset: { width:0, height:2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, borderRadius:10, padding:20}}>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 14, color: '#6B7079', alignSelf:'center'}}>{t("MeetingList.reasonReporting")}</Text>
              <Text style={{fontFamily: "Pretendard-Regular", fontSize: 12, color: '#6B7079', alignSelf:'center', textAlign:'center'}}>{t("MeetingList.reportingNotice")}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex:1}}/>
                <Text style={{fontFamily: 'Pretendard-Regular', fontSize: 14, color: '#D3D3D3'}}>{reportComment.length}/255</Text>
              </View>
              <View style={{borderRadius:10, backgroundColor: "#EEF3FF", padding:5, margin:10}}>
                <TextInput
                  value={reportComment}
                  multiline
                  onChangeText={setReportComment}
                  maxLength={255}/>
              </View>
              <View style={{flex:1}}/>
              <View style={{ flexDirection:"row"}}>
                <View style={{flex:1}}/>
                <TouchableOpacity
                  onPress={() => {setModalVisible2(false); reportMeeing()}} //reportMeeing() 기능 추가
                  disabled={!reportEnabled}
                >
                  <Text style={{fontFamily: "Pretendard-SemiBold", fontSize: 14, color: reportEnabled ? '#EC3232' : '#D3D3D3'}}>{t("MeetingList.toReport")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) }
          </View>
        </View>
      </Modal>
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <TouchableOpacity style={{flex:3}}
            onPress={() => setModalVisible(false)}/>
          <View style={{
            borderTopRightRadius: 10,
            borderTopLeftRadius:10,
            flex:1,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{flex:6, justifyContent: 'center', borderColor: '#e3e3e3', borderBottomWidth:0.7}}>
              <Text style={{fontFamily:'Pretendard-SemiBold', fontSize:16, color:'#000', paddingLeft:15}}>{selectedMeeting.title}</Text>
            </View>
            <View style={{flex:0.5}}/>
            <TouchableOpacity
            style={{flex:5, justifyContent: 'center'}}
              onPress={() => {
                setModalVisible2(true)
                setModalVisible(false)
                }}
            >
              <Text style={{fontFamily:'Pretendard-Medium', fontSize:15, color:'#EC3232', paddingLeft:15}}>{t("MeetingList.toReport")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{flex:5, justifyContent: 'center'}}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{fontFamily:'Pretendard-Medium', fontSize:15, color:'#000', paddingLeft:15}}>{t("MeetingList.cancel")}</Text>
            </TouchableOpacity>
            <View style={{flex:1}}/>
          </View>
        </View>
      </Modal>
      <View>
      <FlatList
        ListHeaderComponent={
        <View>
          <Text style={{fontSize:18, fontFamily: 'Pretendard-Medium', marginRight:5, color: '#09111F', padding:10}}>{t("meeting.category")}</Text>
          <View>
            <FlatList
              data={category}
              renderItem={renderCategory}
              horizontal
              ListHeaderComponent={<View style={{width:10}}/>}
              ListFooterComponent={<View style={{width:10}}/>}
              ItemSeparatorComponent={<View style={{width:10}}/>}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>}
        data={filteredMeetingData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh}/>}
      />
      </View>
		</View>
	)
};

export default MeetingMain;
