import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding1 = ({ navigation }) => {
  const [nickName, setNickName] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);

  const checkNickName = () => {
    // 닉네임 중복 확인 로직을 여기에 추가합니다.
    // 중복되지 않으면 setIsAvailable(true), 중복되면 setIsAvailable(false)를 호출합니다.
    setIsAvailable(true); // 임시로 true로 설정하여 예시를 보여줍니다.
  };

  const saveNickName = async () => {
    await AsyncStorage.setItem('nickName', nickName);
    navigation.navigate('OnBoarding2');
  };  

  return (
    <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
        <Text style={styles.text}>
          반가워요!
        </Text>
        <Text style={styles.text}>
          프로필 선택 후 이름 입력해주세요
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          value={nickName}
          onChangeText={(value) => {
            setNickName(value);
            setIsAvailable(false); // 닉네임이 변경될 때마다 사용 가능 여부를 다시 확인합니다.
          }}
          onBlur={checkNickName} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* 수정된 부분: 파란색 동그라미와 텍스트를 컨테이너로 묶고, 상단 정렬 */}
        {isAvailable && (
          <View style={styles.validationContainer}>
            <View style={styles.validation}>
              <View style={styles.circle}></View>
              <Text style={styles.availableText}>사용하실 수 있는 이름이에요</Text>
            </View>
          </View>
        )}
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={saveNickName}>
          <Text style={styles.buttonText}>
            다음으로 넘어가기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    fontSize: 20,
    borderBottomColor: 'blue',
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: 350,
    height: 60,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  validationContainer: {
    justifyContent: 'flex-start', // 동그라미와 텍스트를 상단에 정렬
    alignItems: 'center',
    marginTop: 10,
  },
  validation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    marginRight: 10,
  },
  availableText: {
    color: 'gray',
    fontSize: 16,
  },
});

export default OnBoarding1;
