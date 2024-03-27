import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

const Modal = () => {
  const modalAnimation = useRef(new Animated.Value(1)).current;

  const showHideModal = () => {
    Animated.timing(modalAnimation, {
      toValue: modalAnimation._value === 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0], // 모달이 아래에서 위로 올라오면서 20%만 노출됩니다.
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={showHideModal}>
        <Text>Show Modal</Text>
      </TouchableOpacity>

      {/* 모달 */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '20%', // 전체 높이의 20%만큼만 표시됩니다.
          backgroundColor: '#FFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: [{ translateY: modalTranslateY }],
        }}
      >
        <Text style={{ marginBottom: 10 }}>Modal Content</Text>
        <Text>This is a modal. You can put any content here.</Text>
        <TouchableOpacity onPress={showHideModal} style={{ marginTop: 10 }}>
          <Text>Close Modal</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Modal;
