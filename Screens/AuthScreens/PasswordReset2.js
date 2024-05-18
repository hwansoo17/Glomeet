import React, { useEffect, useState } from "react";
import { View, Alert, StyleSheet, SafeAreaView, ScrollView ,Text} from "react-native";
import { api } from '../../api';
import LineInput from "../../customComponents/LineInput";
import MainButton from "../../customComponents/MainButton";
import { useTranslation } from "react-i18next";

const PasswordReset2 = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isButtonActive, setButtonactive] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,20}$/;
    return regex.test(password);
  };

  const changeButtonStatus = () => {
    if (password && passwordCheck && isPasswordValid(password)) {
      setButtonactive(true);
    } else {
      setButtonactive(false);
    }
  };

  useEffect(() => {
    changeButtonStatus();
  }, [password, passwordCheck]);

  const handlePasswordChange = (password) => {
    setPassword(password);
    setPasswordErrorMessage(isPasswordValid(password) ? "" : t("register.passwordInvalid"));
  };

  const resetPassword = async () => {
    if (password === passwordCheck) {
      if (!isPasswordValid(password)) {
        Alert.alert(t("register.passwordCheckFailed"));
        return;
      }
      try {
        const response = await api.post('/auth/resetPassword', { email, password });
        if (response.status === 200) {
          Alert.alert(t("register.passwordChangeComplete"));
          navigation.navigate('Login');
        }
      } catch (error) {
        if (error.response?.status === 409) {
          Alert.alert(t("register.passwordChangeFailed"));
        } else {
          console.error("Password reset failed", error);
        }
      }
    } else {
      Alert.alert(t("register.passwordCheckFailed"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: 10 }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 10 }}>
            <View style={{ height: 10 }} />
            <LineInput
              placeholder={t("register.newPassword")}
              secureTextEntry={true}
              value={password}
              onChangeText={handlePasswordChange}
            />
            {password && passwordErrorMessage ? (
              <Text style={styles.errorMessage}>{passwordErrorMessage}</Text>
            ) : null}
            <LineInput
              placeholder={t("register.passwordcheckinput")}
              secureTextEntry={true}
              value={passwordCheck}
              onChangeText={setPasswordCheck}
            />
            <View style={{ height: 20 }} />
            <MainButton
              title={t("register.passwordChange")}
              onPress={resetPassword}
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
});

export default PasswordReset2;
