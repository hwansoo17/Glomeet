import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding1 from "../../assets/onboarding1.svg";
const OnBoarding1 = ({ navigation }) => {
  const [nickName, setNickName] = useState('');

  const saveNickName = async () => {
    await AsyncStorage.setItem('nickName', nickName);
    navigation.navigate('OnBoarding2');
  };

  return (
    <View style={styles.container}>
      <Onboarding1/>
      <Text style={styles.title}>반가워요!</Text>
      <Text style={styles.subtitle}>프로필 선택 후 이름을 입력해주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickName}
        onChangeText={setNickName}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={saveNickName}
      >
        <Text style={styles.buttonText}>다음으로 넘어가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    height: 40,
  },
  button: {
    backgroundColor: '#5782F1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnBoarding1;

