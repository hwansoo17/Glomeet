import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet,TouchableOpacity } from 'react-native';

const CustomModal = ({ visible, text = [], textStyle, onConfirm, onCancel }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    setModalVisible(false);
    onConfirm(); // 부모 컴포넌트에서 전달받은 onConfirm 함수 호출
  };

  const handleCancel = () => {
    setModalVisible(false);
    onCancel(); // 부모 컴포넌트에서 전달받은 onCancel 함수 호출
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
            {text.map((text, index) => (
                <Text key={index} style={[styles.modalText, textStyle[index]]}>{text}</Text>
            ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    height:50,
    width:100,
    backgroundColor: '#5782F1',
    borderRadius: 5,
    padding: 10,
  },
  cancelButton: {
    height:50,
    width:100,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
  },
});

export default CustomModal;



