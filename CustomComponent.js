import React from 'react';
import { View,TouchableOpacity,TextInput, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Homemain from "./assets/homemain.svg";
import Bell from "./assets/bell.svg";
export const Button = ({ title, onPress, buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
export const GradRectangle = ({hasSVG}) => {
  return (
    <View style={[{ flex: 1, borderRadius: 20 }]}>
      <LinearGradient
        colors={['#BFD0FA', 'rgba(213, 223, 249, 1)']}
        style={{ flex: 1, borderRadius: 20 }}
      >
        {hasSVG && (
          <View style={{ flex: 1, flexDirection: 'row',justifyContent: 'center', marginTop:20,marginLeft:60 }}>
            <Homemain/>
          <View style= {{width: 20}}/>
          <Bell/>
          </View> 
        )}
        <View style={styles.textContainer}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.textTitle}>귀여운다은</Text>
          <View style={{justifyContent: 'left', alignItems: 'left'}}>
            <Text style={styles.text}>관심분야</Text>
            <Text style={styles.text}>성향</Text>
            <Text style={styles.text}>키워드 태그</Text>
          </View>
          </View>
          {/* 원하는 만큼 텍스트를 추가할 수 있습니다 */}
        </View>
      
      </LinearGradient>

    </View>
  );
};

export const WhiteButton = ({ title, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.whiteButton, styles.whiteButtonBorder]}>
        <Text style={styles.whiteButtonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

export const NaviWhiteButton = ({ title, destination }) => {
    const navigation = useNavigation();
  
    const handlePress = () => {
      navigation.navigate(destination);
    };
  
    return (
      <TouchableOpacity style={[styles.whiteButton, styles.whiteButtonBorder]} onPress={handlePress}>
        <Text style={styles.whiteButtonText}>{title}</Text>
      </TouchableOpacity>
    );
};
export const WhiteAuthButton = ({title, onPress, isButtonActive}) => {
    <TouchableOpacity
      onPress={onPress}
      disabled={isButtonActive}
      style={[styles.button, isButtonActive ? styles.activeButton : styles.disabledButton]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
}
export const GlomeetText = () => (
    <Text>
      간편하게{' '}
      <Text style={{ fontFamily: 'Pretendard', fontWeight: 'bold' }}>외국인 친구</Text>
      <Text>를</Text>
      <Text> 사귀는 방법! </Text>
      <Text style={{ fontFamily: 'Pretendard', fontWeight: 'bold', color: '#5782F1' }}>
        글로밋
      </Text>
    </Text>
);
export const InputBox = ({ value, onChangeText, placeholder, customStyle }) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, customStyle]} // 기본 스타일과 customStyle을 합침
      placeholder={placeholder}
    />
  );
};

export const InputBoxNovalue = ({ placeholder, customStyle }) => {
  return (
    <TextInput
      style={[styles.input, customStyle]} // 기본 스타일과 customStyle을 합침
      placeholder={placeholder}
    />
  );
};


const styles = StyleSheet.create({
  blueButton: {
    height: 50,
    backgroundColor: '#5782F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  blueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  whiteButton: {
    height: 50,
    backgroundColor: '#5782F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  whiteButtonText: {
    color: '#5782F1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  whiteButtonBorder: {
    backgroundColor: 'white',
    borderColor: '#5782F1',
    borderWidth: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textTitle: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    color: "#001F6F"
  },
  emailText: {
    fontSize: 30,
    marginBottom: 10,
    color: "#887E7E",
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    
  },
  textContainer:{
    flex: 1,
    alignItems: 'center',
    color: '#25282B',
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#887E7E',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  
  button: {
    height: 50,
    backgroundColor: '#5782F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: '#5782F1',
  },
  disabledButton: {
    backgroundColor: '#5782F1',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textStyle: {
    color: '#25282B',
    fontSize: 20,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: '#5782F1',
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
});