import React, {useEffect, useState} from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isButtonactive, setButtonactive] = useState(false);
  const changeButtonStatus = () => {
    if (email != '' && name != '') {
      setButtonactive(true);
    } else {
      setButtonactive(false);
    }
  }
  useEffect(() => {
    changeButtonStatus();
  }, [email, name]);
  console.log(name);
  console.log(email);
  console.log(isButtonactive);
  return (
    <View>
      <TextInput placeholder="이름" value={name}onChangeText={setName}/>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
        <TextInput placeholder="이메일" value={email} onChangeText={setEmail} />
        <TouchableOpacity 
          onPress={() => navigation.navigate('Authentication')} 
          disabled={!isButtonactive}>
          <Text>인증번호 받기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  
}; 
  
export default RegisterScreen;