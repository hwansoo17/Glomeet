import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { api } from '../../api';

const PasswordResetScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  return (
    <View>
      <Text>PasswordResetScreen</Text>
      <TextInput placeholder="이메일" value={email} onChangeText={setEmail} />
      <TouchableOpacity>
        <Text>인증번호 받기</Text>
      </TouchableOpacity>
    </View>
)
  };

export default PasswordResetScreen;
