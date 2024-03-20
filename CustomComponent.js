import React from 'react';
import { TouchableOpacity,TextInput, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const BlueButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.blueButton}>
      <Text style={styles.blueButtonText}>{title}</Text>
    </TouchableOpacity>
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
export const InputBox = ({ value, onChangeText, placeholder }) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
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
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  activeButton: {
    backgroundColor: '#5782F1',
  },
  disabledButton: {
    backgroundColor: '#5782F1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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