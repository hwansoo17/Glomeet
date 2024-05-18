import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { api } from '../../api';
import LineInput from "../../customComponents/LineInput";
import MainButton from "../../customComponents/MainButton";
import { useTranslation } from "react-i18next";

const Register2 = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { email } = route.params;
  const [nickName, setNickName] = useState("");
  const [serverNickName, setServerNickName] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isDuplicateButtonActive, setDuplicateButtonActive] = useState(false);
  const [nickNameErrorMessage, setNickNameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,20}$/;
    return regex.test(password);
  };

  const nickNameLengthCheck = () => {
    if (nickName.length < 2 || nickName.length > 10 ) {
      setNickNameErrorMessage(t("register.nicknameInvalid"));
    } else {
      setNickNameErrorMessage("");
    }
  };

  const doubleCheckName = async () => {
    if (nickName.length < 2 || nickName.length > 10) {
      Alert.alert(t("register.nicknameInvalid"));
      return;
    }
    try {
      const response = await api.post('/auth/nickNameCheck', { nickName });
      if (response.status === 200) {
        Alert.alert(t("register.nicknameAvailable"));
        setServerNickName(nickName);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert(t("register.nicknameUnavailable"));
      }
    }
  };

  const changeButtonStatus = () => {
    if (password && passwordCheck && serverNickName) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
    setPasswordErrorMessage(isPasswordValid(password) ? "" : t("register.passwordInvalid"));
  };

  const signUp = async () => {
    if (password !== passwordCheck) {
      Alert.alert(t("register.passwordCheckFailed"));
      return;
    }
    if (!isPasswordValid(password)) {
      Alert.alert(t("register.passwordCheckFailed"));
      return;
    }
    try {
      const response = await api.post('/auth/signUp', { email, nickName: serverNickName, password });
      if (response.status === 200) {
        Alert.alert(t("register.signupComplete"));
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert(t("register.signupfailed"));
      }
    }
  };

  useEffect(() => {
    changeButtonStatus();
  }, [password, passwordCheck, serverNickName]);

  useEffect(() => {
    nickNameLengthCheck();
    setDuplicateButtonActive(nickName !== "");
  }, [nickName]);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: 10 }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 7 }}>
                <LineInput
                  value={nickName}
                  onChangeText={setNickName}
                  placeholder={t("register.nickNameinput")}
                />
              </View>
              <View style={{ flex: 0.5 }} />
              <View style={{ flex: 3 }}>
                <MainButton
                  title={t("register.duplicateCheck")}
                  onPress={doubleCheckName}
                  style={{ borderRadius: 5 }}
                  textStyle={{ fontSize: 14, textAlign: 'center' }}
                  disabled={!isDuplicateButtonActive}
                />
              </View>
            </View>
            {nickName && nickNameErrorMessage ? (
              <Text style={styles.errorMessage}>{nickNameErrorMessage}</Text>
            ) : (
              <Text style={styles.infoMessage}>{serverNickName}</Text>
            )}
            <View style={{ height: 10 }} />
            <LineInput
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={true}
              placeholder={t("register.passwordinput")}
            />
            {password && passwordErrorMessage ? (
              <Text style={styles.errorMessage}>{passwordErrorMessage}</Text>
            ) : (
              null
            )}
            <LineInput
              value={passwordCheck}
              onChangeText={setPasswordCheck}
              secureTextEntry={true}
              placeholder={t("register.passwordcheckinput")}
            />
            <View style={{ height: 20 }} />
            <MainButton
              title={t("register.signup")}
              onPress={signUp}
              disabled={!isButtonActive}
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  errorMessage: {
    fontFamily: "pretendard-Medium",
    color: "#EC3232",
    fontSize: 12,
    paddingVertical: 10,
  },
  infoMessage: {
    fontFamily: "pretendard-Medium",
    color: "#868686",
    fontSize: 14,
    paddingVertical: 10,
  },
});

export default Register2;
