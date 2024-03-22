import React ,{useState} from "react";
import {View, Text, TouchableOpacity, FlatList, StyleSheet, Modal} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../api"
import { Button } from '../../CustomComponent';
import CustomModal from '../../Alert';
const OnBoarding4 = ({navigation}) => {
  const [userPersonalType, setUserPersonalType] = useState('')
  const [isButtonActive, setButtonActive] = useState(null);
  const [modalVisible,setModalVisible] = useState(false); 
  const personalTypeData = ['외향적', '내향적']
  const savePersonalType = async() => {
    const email = await AsyncStorage.getItem('email')
    const userContinent = await AsyncStorage.getItem('userContinent')
    const userHobby = await AsyncStorage.getItem('userHobby')
    try {
      const response = await api.post('/auth/inputAdditionalInfo', {email: email, country: userContinent, interest: userHobby, type: userPersonalType}) 
      if (response.status == 200) {
        console.log(email, userContinent, userHobby, userPersonalType)
        navigation.navigate('OnBoarding5')
        setModalVisible(true)
      }; 
    } catch (error) {
      if (error.response.status == 409) {
        console.log(error.response.status);
      };
    }
  } 
  const handlePress = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    console.log('확인 버튼을 눌렀습니다.');
    setModalVisible(false);
  };

  const handleCancel = () => {
    console.log('취소 버튼을 눌렀습니다.');
    setModalVisible(false);
  };    
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        isButtonActive === item && styles.isButtonActive // 선택된 아이템인 경우 스타일을 적용
      ]}
      onPress={() => {
        setUserPersonalType(item);
        setButtonActive(item); // 아이템 선택 시 상태 업데이트
      }}>
      <Text style = {[styles.textstyle, isButtonActive === item && styles.activeTextStyle]}>{item}</Text>
    </TouchableOpacity>
  );
  const TEXTS = {
    TITLE: ['당신은', '성향은 무엇인가요?'],
    SUBTITLE: ['Choose one option for now.', 'You can explore others later.'],
    Alert: ["글로밋에서 보내는 정보 및", "알림(push)를 받아보시겠습니까?","수신 동의 시 챌린지 및 매칭 완료 등 정보에 대한" ,"알림을 받아보실 수 있습니다."],
  };
return (
  <View style={styles.container}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 8 }}>
        <View style={{ flex: 1 }}/>
        <View style={{ flex: 8 }}>
          
          <Text style={styles.title}>{TEXTS.TITLE[0]}</Text>
          <Text style={styles.title}>{TEXTS.TITLE[1]}</Text>
          <Text style={styles.subtitle}>{TEXTS.SUBTITLE[0]}</Text>
          <Text style={styles.subtitle}>{TEXTS.SUBTITLE[1]}</Text>
          <View style={{ height: 20 }} />
          <FlatList
            data={personalTypeData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
          <Button title='다음으로 넘어가기' onPress={savePersonalType} textStyle={{fontWeight: 'bold'}}/>
          <CustomModal
           visible={modalVisible}
           text={[TEXTS.Alert[0],TEXTS.Alert[1],TEXTS.Alert[2],TEXTS.Alert[3]]}
           textStyle={[
            { fontWeight: 'bold',fontSize: 16 }, 
            {fontWeight: 'bold',fontSize: 16 },
            { color: 'black',fontSize: 13 },
          ]}
           onCancel={handleCancel}
           onConfirm={handleConfirm}
          />
        </View>
        <View style={{ flex: 1 }}/>
      </View>
      <View style={{ flex: 1 }} />
    </View>
    <View>
    <TouchableOpacity
    onPress={() => navigation.navigate('OnBoarding3')}>
    <Text>온보딩3 화면으로</Text>
  </TouchableOpacity>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  item: {
    height:40,
    borderBottomWidth: 1,
    borderColor: '#868686',
    backgroundColor: '#ECE9E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    color:"#868686"  
  },
  isButtonActive: {
    backgroundColor: '#5782F1',
  },
  button: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#5782F1',
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  textstyle : {
    fontSize: 13,
    textAlign: 'center',
    color: '#3B3B3B',
  },
  subtitle: {
    textAlign: 'center',

  },
  activeTextStyle: {
    color: 'white', // 활성화된 아이템의 텍스트 색상 변경
  },
});
export default OnBoarding4;